/**
 * POST /api/builder-preview/generate
 *
 * Generates an AI product-only preview from a BuilderVisualSpec.
 *
 * Provider priority (first configured wins):
 *   1. XAI_API_KEY         — Grok Imagine (grok-imagine-image-2.0)
 *   2. HF_TOKEN            — HuggingFace FLUX.1-schnell
 *   3. REPLICATE_API_TOKEN — Replicate SDXL
 *   4. Pollinations.ai     — zero-config fallback
 *
 * Cached in Cloudinary at velura/custom-previews/{hash}.
 * Pass `{ refresh: true }` to regenerate and overwrite the cache.
 */

import { NextRequest, NextResponse } from 'next/server'
import { InferenceClient } from '@huggingface/inference'
import type { BuilderVisualSpec } from '@/lib/builderVisualSpec'
import { specToHash, specToSeed, buildAIPrompt, buildPollinationsPrompt } from '@/lib/builderVisualSpec'
import { access, mkdir, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { getCloudinaryUrl, uploadFromBuffer, uploadFromUrl } from '@/lib/cloudinary-upload'
import { hasXaiKey, xaiImageModel } from '@/lib/xai'
import { checkRateLimit, clientIp } from '@/lib/rateLimit'
import {
  CB_BRA_TYPES,
  CB_STRAP_STYLES,
  CB_PADDING_OPTIONS,
  CB_UNDERWIRE_OPTIONS,
  CB_CLOSURE_OPTIONS,
  CB_SUPPORT_OPTIONS,
  CB_FABRIC_OPTIONS,
  CB_COLOR_OPTIONS,
} from '@/data/builderOptions'

export const maxDuration = 120

const NEGATIVE_PROMPT =
  'person, human, model, body, torso, skin, face, hands, mannequin, dummy, ' +
  'nudity, text, watermark, logo, cartoon, illustration, sketch, blurry, low quality, NSFW'

const VALID_BRA_TYPES: Set<string>    = new Set(CB_BRA_TYPES.map((o) => o.id))
const VALID_STRAP_STYLES: Set<string> = new Set([...CB_STRAP_STYLES.map((o) => o.id), 'none'])
const VALID_PADDING: Set<string>      = new Set(CB_PADDING_OPTIONS.map((o) => o.id))
const VALID_UNDERWIRE: Set<string>    = new Set(CB_UNDERWIRE_OPTIONS.map((o) => o.id))
const VALID_CLOSURES: Set<string>     = new Set(CB_CLOSURE_OPTIONS.map((o) => o.id))
const VALID_SUPPORT: Set<string>      = new Set(CB_SUPPORT_OPTIONS.map((o) => o.id))
const VALID_FABRICS: Set<string>      = new Set(CB_FABRIC_OPTIONS.map((o) => o.id))
const VALID_COLORS: Set<string>       = new Set(CB_COLOR_OPTIONS.map((o) => o.id))

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

type Provider = 'xai' | 'huggingface' | 'replicate' | 'pollinations'
type ImageData = { kind: 'buffer'; data: Buffer } | { kind: 'url'; data: string }

function isPng(buf: Buffer): boolean {
  return buf[0] === 0x89 && buf[1] === 0x50
}

async function getLocalPreview(hash: string): Promise<string | null> {
  for (const ext of ['png', 'jpg'] as const) {
    try {
      await access(path.join(process.cwd(), 'public', 'previews', `${hash}.${ext}`))
      return `/previews/${hash}.${ext}`
    } catch { /* miss */ }
  }
  return null
}

async function persistLocal(buf: Buffer, hash: string): Promise<string> {
  const dir = path.join(process.cwd(), 'public', 'previews')
  await mkdir(dir, { recursive: true })
  const name = `${hash}.${isPng(buf) ? 'png' : 'jpg'}`
  await writeFile(path.join(dir, name), buf)
  return `/previews/${name}`
}

async function persistImage(imageData: ImageData, publicId: string, hash: string, overwrite: boolean): Promise<string> {
  try {
    if (imageData.kind === 'buffer') {
      return await uploadFromBuffer(imageData.data, publicId, { overwrite })
    }
    return await uploadFromUrl(imageData.data, publicId, { overwrite })
  } catch (err) {
    console.warn('[builder-preview] Cloudinary cache failed:', err instanceof Error ? err.message : err)
    if (imageData.kind === 'buffer') return persistLocal(imageData.data, hash)
    return imageData.data
  }
}

async function generateWithXai(prompt: string, seed: number): Promise<Buffer> {
  const { generateImage } = await import('ai')
  const { image } = await generateImage({
    model: xaiImageModel(),
    prompt,
    aspectRatio: '3:4',
    seed,
    maxRetries: 1,
    abortSignal: AbortSignal.timeout(40_000),
    providerOptions: {
      xai: { quality: 'low' },
    },
  })
  return Buffer.from(image.uint8Array)
}

async function generateWithHuggingFace(
  prompt: string,
  negativePrompt: string,
  token: string,
): Promise<Buffer> {
  const hf = new InferenceClient(token)
  const model = process.env.HF_MODEL ?? 'black-forest-labs/FLUX.1-schnell'
  const blob = await hf.textToImage(
    {
      model,
      inputs: prompt,
      parameters: {
        negative_prompt: negativePrompt,
        num_inference_steps: 8,
        guidance_scale: 0,
        width: 768,
        height: 1024,
      },
    },
    { outputType: 'blob', signal: AbortSignal.timeout(18_000) },
  )
  return Buffer.from(await blob.arrayBuffer())
}

async function generateWithPollinations(prompt: string, seed: number): Promise<Buffer> {
  const encoded = encodeURIComponent(prompt.slice(0, 700))
  const url =
    `https://image.pollinations.ai/prompt/${encoded}` +
    `?width=768&height=1024&model=flux&nologo=true&nofeed=true&private=true&seed=${seed}`

  const res = await fetch(url, {
    method: 'GET',
    signal: AbortSignal.timeout(40_000),
    headers: { Accept: 'image/*' },
  })

  if (!res.ok) {
    throw new Error(`Pollinations error ${res.status}`)
  }

  const type = res.headers.get('content-type') ?? ''
  if (type.includes('text/html') || type.includes('application/json')) {
    throw new Error('Pollinations returned a non-image response')
  }

  const buffer = Buffer.from(await res.arrayBuffer())
  if (buffer.byteLength < 8_000) {
    throw new Error('Pollinations returned an empty image')
  }
  return buffer
}

interface ReplicatePrediction {
  id: string
  status: 'starting' | 'processing' | 'succeeded' | 'failed' | 'canceled'
  output?: string[]
  error?: string
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
    method: 'POST',
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      version,
      input: {
        prompt,
        negative_prompt: negativePrompt,
        width: 768,
        height: 1024,
        num_outputs: 1,
        guidance_scale: 7.5,
        num_inference_steps: 30,
        scheduler: 'K_EULER',
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
  const deadline = Date.now() + 90_000

  while (Date.now() < deadline) {
    await new Promise((r) => setTimeout(r, 2_500))
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

export async function POST(req: NextRequest) {
  try {
    return await handleGenerate(req)
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Generation failed'
    console.error('[builder-preview]', msg)
    return NextResponse.json({ error: msg, code: 'GENERATION_FAILED' }, { status: 502 })
  }
}

async function handleGenerate(req: NextRequest) {
  if (!checkRateLimit(`builder-preview:${clientIp(req)}`, 8)) {
    return NextResponse.json({ error: 'Rate limit exceeded. Try again in an hour.' }, { status: 429 })
  }

  let body: unknown
  try { body = await req.json() }
  catch { return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 }) }

  const raw = (body as Record<string, unknown>)?.spec
  const refresh = Boolean((body as Record<string, unknown>)?.refresh)
  if (!validateSpec(raw)) {
    return NextResponse.json({ error: 'Invalid or incomplete spec' }, { status: 400 })
  }
  const spec = raw as BuilderVisualSpec

  const hash = specToHash(spec)
  const publicId = `velura/custom-previews/${hash}`

  if (!refresh) {
    try {
      const cached = (await getCloudinaryUrl(publicId)) ?? (await getLocalPreview(hash))
      if (cached) return NextResponse.json({ url: cached, cached: true, hash })
    } catch { /* non-fatal */ }
  }

  const fullPrompt = buildAIPrompt(spec)
  const shortPrompt = buildPollinationsPrompt(spec)
  const seed = specToSeed(spec, refresh ? Date.now() % 10_000 : 0)

  const hfToken = process.env.HF_TOKEN
  const replicateToken = process.env.REPLICATE_API_TOKEN

  let imageData: ImageData | null = null
  let provider: Provider | undefined
  const errors: string[] = []

  if (hasXaiKey()) {
    try {
      imageData = { kind: 'buffer', data: await generateWithXai(fullPrompt, seed) }
      provider = 'xai'
    } catch (err) {
      errors.push(`xai: ${err instanceof Error ? err.message : 'failed'}`)
      console.warn('[builder-preview] xAI failed:', err instanceof Error ? err.message : err)
    }
  }

  if (!imageData && hfToken) {
    try {
      imageData = { kind: 'buffer', data: await generateWithHuggingFace(fullPrompt, NEGATIVE_PROMPT, hfToken) }
      provider = 'huggingface'
    } catch (err) {
      errors.push(`hf: ${err instanceof Error ? err.message : 'failed'}`)
      console.warn('[builder-preview] HF failed:', err instanceof Error ? err.message : err)
    }
  }

  if (!imageData && replicateToken) {
    try {
      imageData = { kind: 'url', data: await generateWithReplicate(fullPrompt, NEGATIVE_PROMPT, replicateToken) }
      provider = 'replicate'
    } catch (err) {
      const e = err as Error & { code?: string }
      if (e.code === 'INSUFFICIENT_CREDITS') {
        return NextResponse.json(
          { error: 'Replicate account needs credits.', code: 'INSUFFICIENT_CREDITS', detail: 'https://replicate.com/account/billing' },
          { status: 402 },
        )
      }
      errors.push(`replicate: ${e.message}`)
      console.warn('[builder-preview] Replicate failed:', e.message)
    }
  }

  if (!imageData) {
    try {
      imageData = { kind: 'buffer', data: await generateWithPollinations(shortPrompt, seed) }
      provider = 'pollinations'
    } catch (err) {
      errors.push(`pollinations: ${err instanceof Error ? err.message : 'failed'}`)
      const msg = err instanceof Error ? err.message : 'Generation failed'
      return NextResponse.json(
        { error: msg, code: 'GENERATION_FAILED', detail: errors.join(' · ') },
        { status: 502 },
      )
    }
  }

  const finalUrl = await persistImage(imageData, publicId, hash, refresh)
  return NextResponse.json({ url: finalUrl, cached: false, hash, provider })
}
