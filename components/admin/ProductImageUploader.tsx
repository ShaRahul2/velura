'use client'

import { useState, useRef, ChangeEvent } from 'react'
import { Upload } from 'lucide-react'

const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']
const MAX_BYTES     = 10 * 1024 * 1024 // 10 MB (Cloudinary free tier limit)

type ImageTypeField = 'front' | 'back' | 'lifestyle' | 'detail'

interface Props {
  productId:  number
  onUploaded: () => void
}

interface UploadSignature {
  signature:  string
  timestamp:  number
  folder:     string
  apiKey:     string
  cloudName:  string
}

interface CloudinaryUploadResult {
  secure_url: string
  public_id:  string
}

export function ProductImageUploader({ productId, onUploaded }: Props) {
  const inputRef   = useRef<HTMLInputElement>(null)
  const [progress, setProgress] = useState<number | null>(null)
  const [imgType,  setImgType]  = useState<ImageTypeField>('front')
  const [error,    setError]    = useState('')

  async function handleFile(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return

    setError('')

    if (!ALLOWED_TYPES.includes(file.type)) {
      setError('Only JPEG, PNG, WebP, and GIF files are allowed.')
      return
    }
    if (file.size > MAX_BYTES) {
      setError('File must be under 10 MB.')
      return
    }

    try {
      setProgress(0)

      // Step 1 — get upload signature from our server
      const sigRes = await fetch(`/api/products/${productId}/images/upload-signature`, {
        method: 'POST',
      })
      if (!sigRes.ok) throw new Error('Could not get upload signature.')
      const { signature, timestamp, folder, apiKey, cloudName } =
        await sigRes.json() as UploadSignature

      // Step 2 — upload directly from browser to Cloudinary
      const formData = new FormData()
      formData.append('file',      file)
      formData.append('api_key',   apiKey)
      formData.append('timestamp', String(timestamp))
      formData.append('signature', signature)
      formData.append('folder',    folder)

      const uploadResult = await new Promise<CloudinaryUploadResult>((resolve, reject) => {
        const xhr = new XMLHttpRequest()
        xhr.upload.onprogress = (ev) => {
          if (ev.lengthComputable) setProgress(Math.round((ev.loaded / ev.total) * 100))
        }
        xhr.onload = () => {
          if (xhr.status < 300) {
            resolve(JSON.parse(xhr.responseText) as CloudinaryUploadResult)
          } else {
            reject(new Error('Cloudinary upload failed.'))
          }
        }
        xhr.onerror = () => reject(new Error('Network error during upload.'))
        xhr.open('POST', `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`)
        xhr.send(formData)
      })

      setProgress(100)

      // Step 3 — save metadata to our DB
      const metaRes = await fetch(`/api/products/${productId}/images`, {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({
          key:      uploadResult.public_id,   // Cloudinary public_id — used for deletes
          url:      uploadResult.secure_url,
          alt:      `${file.name.replace(/\.[^.]+$/, '')} — ${imgType} view`,
          position: 999,
          type:     imgType,
          isPrimary: false,
        }),
      })
      if (!metaRes.ok) throw new Error('Could not save image metadata.')

      setProgress(null)
      if (inputRef.current) inputRef.current.value = ''
      onUploaded()
    } catch (err) {
      setProgress(null)
      setError(err instanceof Error ? err.message : 'Upload failed.')
    }
  }

  const IMAGE_TYPES: ImageTypeField[] = ['front', 'back', 'lifestyle', 'detail']

  return (
    <div className="space-y-3">
      {/* Image type selector */}
      <div className="flex gap-2">
        {IMAGE_TYPES.map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => setImgType(t)}
            className={[
              'px-3 py-1 rounded-[3px] text-[0.65rem] tracking-[0.1em] uppercase transition-colors',
              imgType === t
                ? 'bg-[rgba(184,168,152,0.2)] text-[#B8A898] border border-[rgba(184,168,152,0.4)]'
                : 'border border-[rgba(184,168,152,0.12)] text-[rgba(237,233,228,0.35)] hover:border-[rgba(184,168,152,0.25)]',
            ].join(' ')}
          >
            {t}
          </button>
        ))}
      </div>

      {/* Drop zone */}
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        disabled={progress !== null}
        className="w-full border border-dashed border-[rgba(184,168,152,0.2)] rounded-[3px] py-8 flex flex-col items-center gap-2 hover:border-[rgba(184,168,152,0.4)] transition-colors disabled:opacity-50"
      >
        <Upload size={18} className="text-[rgba(237,233,228,0.25)]" />
        <span className="text-[0.72rem] text-[rgba(237,233,228,0.35)] tracking-[0.06em]">
          Click to upload {imgType} image
        </span>
        <span className="text-[0.62rem] text-[rgba(237,233,228,0.2)]">
          JPEG · PNG · WebP · max 10 MB
        </span>
      </button>

      <input
        ref={inputRef}
        type="file"
        accept={ALLOWED_TYPES.join(',')}
        onChange={handleFile}
        className="hidden"
      />

      {/* Progress bar */}
      {progress !== null && (
        <div className="space-y-1">
          <div className="w-full bg-[rgba(237,233,228,0.08)] rounded-[2px] h-0.5">
            <div
              className="bg-[#B8A898] h-0.5 rounded-[2px] transition-all duration-200"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="text-[0.65rem] text-[rgba(237,233,228,0.3)] text-right">
            {progress < 100 ? `${progress}%` : 'Saving…'}
          </p>
        </div>
      )}

      {error && (
        <p className="text-[0.72rem] text-[#9A8878]">{error}</p>
      )}
    </div>
  )
}
