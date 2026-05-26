import { v2 as cloudinary } from 'cloudinary'

// Configured once — server-only module, never imported client-side
cloudinary.config({
  cloud_name:  process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key:     process.env.CLOUDINARY_API_KEY,
  api_secret:  process.env.CLOUDINARY_API_SECRET,
})

// ── Upload signature ──────────────────────────────────────────────────────────
// Returns the signed params the browser needs to upload directly to Cloudinary.
// The API secret never leaves the server.

export interface UploadSignature {
  signature:  string
  timestamp:  number
  folder:     string
  apiKey:     string
  cloudName:  string
}

export function buildUploadSignature(productId: number): UploadSignature {
  const timestamp = Math.round(Date.now() / 1000)
  const folder    = `velura/products/${productId}`

  const signature = cloudinary.utils.api_sign_request(
    { timestamp, folder },
    process.env.CLOUDINARY_API_SECRET!
  )

  return {
    signature,
    timestamp,
    folder,
    apiKey:    process.env.CLOUDINARY_API_KEY!,
    cloudName: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME!,
  }
}

// ── Delete asset ──────────────────────────────────────────────────────────────
// `publicId` is the Cloudinary public_id stored in ProductImage.key

export async function destroyCloudinaryAsset(publicId: string): Promise<void> {
  await cloudinary.uploader.destroy(publicId)
}

// ── AI preview cache helpers ──────────────────────────────────────────────────

/**
 * Check whether an AI-generated preview already exists in Cloudinary.
 * Returns the secure_url if found, null if not.
 * Used by /api/builder-preview/generate to skip redundant AI calls.
 */
export async function getCloudinaryUrl(publicId: string): Promise<string | null> {
  try {
    const result = await cloudinary.api.resource(publicId)
    return (result as { secure_url: string }).secure_url ?? null
  } catch {
    return null
  }
}

/**
 * Upload an image from a remote URL to Cloudinary under the given publicId.
 * Used to cache AI-generated previews under velura/custom-previews/{hash}.
 */
export async function uploadFromUrl(
  imageUrl: string,
  publicId: string,
): Promise<string> {
  const result = await cloudinary.uploader.upload(imageUrl, {
    public_id:    publicId,
    overwrite:    false,
    resource_type: 'image',
    folder:       '',   // publicId already contains the full path
  })
  return (result as { secure_url: string }).secure_url
}
