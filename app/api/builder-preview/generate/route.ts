/**
 * POST /api/builder-preview/generate
 *
 * Generates an AI product-only preview from a BuilderVisualSpec.
 *
 * Provider priority (first configured wins):
 *   1. HF_TOKEN            — HuggingFace serverless via SDK (FREE)
 *   2. REPLICATE_API_TOKEN — Replicate SDXL (paid)
 *   3. Pollinations.ai     — always available, zero config, genuinely free
 *
 * Every generated image is cached in Cloudinary (velura/custom-previews/{hash})
 * so the same spec combination is never generated twice.
 *
 * Rate limit: 5 per IP per hour (in-memory; use Redis in production).
 * Rate limit is skipped in development mode.
 */

import { NextRequest, NextResponse } from 'next/server'
import { HfInference } from '@huggingface/inference'
import type { BuilderVisualSpec } from '@/lib/builderVisualSpec'
import { specToHash, buildAIPrompt, buildPollinationsPrompt } from '@/lib/builderVisualSpec'
import { getCloudinaryUrl, uploadFromUrl } from '@/lib/cloudinary-upload'

export const maxDuration = 120  // seconds

// ── Rate limiter ──────────────────────────────────────────────────────────────

interface RateLimitEntry { count: number; resetAt: number }
const rateLimitMap = new Map<string, RateLimitEntry>()

function checkRateLimit(ip: string): boolean {
  if (process.env.NODE_ENV === 'development') return true   // unlimited in dev

  const now   = Date.now()
  const entry = rateLimitMap.get(ip)
  if (!entry || entry.resetAt < now) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + 3_600_000 })
    return true
  }
  if (entry.count >= 5) return false
  entry.count++
  return true
}

// ── Input validation ──────────────────────────────────────────────────────────

const VALID_BRA_TYPES    = new Set(['everyday','balconette','padded','sports','lace','wirefree','strapless','bridal'])
const VALID_STRAP_STYLES = new Set(['classic','adjustable','crossback','wide','none'])
const VALID_PADDING      = new Set(['none','light','medium','high'])
const VALID_UNDERWIRE    = new Set(['wired','wirefree'])
const VALID_CLOSURES     = new Set(['back','front','pull-on'])
const VALID_SUPPORT      = new Set(['light','medium','high'])
const VALID_FABRICS      = new Set(['cotton','silk','microfiber','lace','smooth'])
const VALID_COLORS       = new Set([
  // Neutrals
  'ivory','blush','nude','cream','champagne','rose','smoke','mauve','slate','deep','black',
  // Pinks & Reds
  'pink','blushrose','red','burgundy',
  // Blues & Greens
  'lavender','navy','cobalt','sage','forest',
])

function validateSpec(s: unknown): s is BuilderVisualSpec {
  if (!s || typeof s !== 'object') return false
  const spec = s as Record<string, unknown>
  return (
    VALID_BRA_TYPES.has(spec.braType as string)       &&
    VALID_STRAP_STYLES.has(spec.strapStyle as string) &&
    VALID_PADDING.has(spec.padding as string)         &&
    VALID_UNDERWIRE.has(spec.underwire as string)     &&
    VALID_CLOSURES.has(spec.closure as string)        &&
    VALID_SUPPORT.has(spec.support as string)         &&
    VALID_FABRICS.has(spec.fabric as string)          &&
    VALID_COLORS.has(spec.colorId as string)
  )
}

// ── Provider 1: HuggingFace via official SDK ──────────────────────────────────
// SDK handles URL routing, retries, and streaming internally.
// Defaults to FLUX.1-schnell — 4 steps, fast, high quality.

async function generateWithHuggingFace(
  prompt: string,
  negativePrompt: string,
  token: string,
): Promise<Buffer> {
  const hf    = new HfInference(token)
  const model = process.env.HF_MODEL ?? 'black-forest-labs/FLUX.1-schnell'

  const blob = await hf.textToImage(
    {
      model,
      inputs: prompt,
      parameters: {
        negative_prompt:     negativePrompt,
        num_inference_steps: 4,
        guidance_scale:      0,
        width:               768,
        height:              1024,
      },
    },
    { outputType: 'blob' },
  )

  return Buffer.from(await blob.arrayBuffer())
}

// ── Provider 2: Pollinations.ai (zero-config, always free) ───────────────────
// Uses FLUX model. GET request with URL-encoded prompt.
// Returns binary JPEG. No account or token required.

async function generateWithPollinations(prompt: string): Promise<Buffer> {
  const encoded = encodeURIComponent(prompt.slice(0, 480))   // leave room for params
  const seed    = Math.floor(Math.random() * 999_999)
  const url =
    `https://image.pollinations.ai/prompt/${encoded}` +
    `?width=768&height=1024&model=flux&nologo=true&nofeed=true&seed=${seed}`

  const res = await fetch(url, { method: 'GET' })

  if (!res.ok) {
    throw new Error(`Pollinations error ${res.status}`)
  }

  return Buffer.from(await res.arrayBuffer())
}

// ── Provider 3: Replicate (paid) ─────────────────────────────────────────────

interface ReplicatePrediction {
  id:      string
  status:  'starting' | 'processing' | 'succeeded' | 'failed' | 'canceled'
  output?: string[]
  error?:  string
}

async function generateWithReplicate(
  prompt: string,
  negativePrompt: string,
  token: string,
): Promise<string> {
  const version =
    process.env.REPLICATE_SDXL_VERSION ??
    '7762fd07cf82c948538e41f63f77d685e02b063e37e496e96eefd46c929f9bdc'

  const createRes = await fetch('https://api.replicate.com/v1/predictions', {
    method:  'POST',
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      version,
      input: {
        prompt, negative_prompt: negativePrompt,
        width: 768, height: 1024, num_outputs: 1,
        guidance_scale: 7.5, num_inference_steps: 30, scheduler: 'K_EULER',
      },
    }),
  })

  if (!createRes.ok) {
    if (createRes.status === 402) {
      throw Object.assign(new Error('INSUFFICIENT_CREDITS'), { code: 'INSUFFICIENT_CREDITS' })
    }
    const t = await createRes.text()
    throw new Error(`Replicate ${createRes.status}: ${t.slice(0, 200)}`)
  }

  const created: ReplicatePrediction = await createRes.json()
  const deadline = Date.now() + 120_000

  while (Date.now() < deadline) {
    await new Promise((r) => setTimeout(r, 3_000))
    const poll: ReplicatePrediction = await fetch(
      `https://api.replicate.com/v1/predictions/${created.id}`,
      { headers: { Authorization: `Bearer ${token}` } },
    ).then((r) => r.json())
    if (poll.status === 'succeeded' && poll.output?.[0]) return poll.output[0]
    if (poll.status === 'failed' || poll.status === 'canceled') {
      throw new Error(poll.error ?? 'Replicate prediction failed')
    }
  }

  throw new Error('Replicate generation timed out')
}

// ── Route handler ─────────────────────────────────────────────────────────────

type Provider  = 'pollinations' | 'huggingface' | 'replicate'
type ImageData = { kind: 'buffer'; data: Buffer } | { kind: 'url'; data: string }

export async function POST(req: NextRequest) {
  // 1. Rate limit
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'unknown'
  if (!checkRateLimit(ip)) {
    return NextResponse.json({ error: 'Rate limit exceeded. Try again in an hour.' }, { status: 429 })
  }

  // 2. Parse & validate
  let body: unknown
  try { body = await req.json() }
  catch { return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 }) }

  const raw = (body as Record<string, unknown>)?.spec
  if (!validateSpec(raw)) {
    return NextResponse.json({ error: 'Invalid or incomplete spec' }, { status: 400 })
  }
  const spec = raw as BuilderVisualSpec

  // 3. Cloudinary cache check
  const hash     = specToHash(spec)
  const publicId = `velura/custom-previews/${hash}`

  try {
    const cached = await getCloudinaryUrl(publicId)
    if (cached) return NextResponse.json({ url: cached, cached: true, hash })
  } catch { /* non-fatal */ }

  // 4. Build prompts — full prompt for HF/Replicate, short for Pollinations
  const fullPrompt  = buildAIPrompt(spec)
  const shortPrompt = buildPollinationsPrompt(spec)
  const negativePrompt =
    'person, human body, face, skin, mannequin, nudity, text, watermark, logo, ' +
    'blurry, low quality, illustration, cartoon, sketch, NSFW'

  // 5. Try providers in order
  const hfToken        = process.env.HF_TOKEN
  const replicateToken = process.env.REPLICATE_API_TOKEN

  let imageData: ImageData
  let provider:  Provider

  if (hfToken) {
    try {
      imageData = { kind: 'buffer', data: await generateWithHuggingFace(fullPrompt, negativePrompt, hfToken) }
      provider  = 'huggingface'
    } catch (err) {
      console.warn('[builder-preview] HF failed, falling back to Pollinations:', err instanceof Error ? err.message : err)
      imageData = { kind: 'buffer', data: await generateWithPollinations(shortPrompt) }
      provider  = 'pollinations'
    }
  } else if (replicateToken) {
    try {
      imageData = { kind: 'url', data: await generateWithReplicate(fullPrompt, negativePrompt, replicateToken) }
      provider  = 'replicate'
    } catch (err) {
      const e = err as Error & { code?: string }
      if (e.code === 'INSUFFICIENT_CREDITS') {
        return NextResponse.json(
          { error: 'Replicate account needs credits.', code: 'INSUFFICIENT_CREDITS', detail: 'https://replicate.com/account/billing' },
          { status: 402 },
        )
      }
      console.warn('[builder-preview] Replicate failed, falling back to Pollinations:', e.message)
      imageData = { kind: 'buffer', data: await generateWithPollinations(shortPrompt) }
      provider  = 'pollinations'
    }
  } else {
    try {
      imageData = { kind: 'buffer', data: await generateWithPollinations(shortPrompt) }
      provider  = 'pollinations'
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Generation failed'
      return NextResponse.json({ error: msg, code: 'GENERATION_FAILED' }, { status: 502 })
    }
  }

  // 6. Upload to Cloudinary for permanent caching
  const uploadSrc =
    imageData.kind === 'buffer'
      ? `data:image/jpeg;base64,${imageData.data.toString('base64')}`
      : imageData.data

  let finalUrl: string
  try {
    finalUrl = await uploadFromUrl(uploadSrc, publicId)
  } catch {
    finalUrl = uploadSrc   // serve ephemeral source directly if upload fails
  }

  return NextResponse.json({ url: finalUrl, cached: false, hash, provider })
}
