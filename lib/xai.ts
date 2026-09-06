import { xai } from '@ai-sdk/xai'

export const XAI_MODEL = 'grok-4.6'
export const XAI_IMAGE_MODEL = process.env.XAI_IMAGE_MODEL ?? 'grok-imagine-image-2.0'

export function hasXaiKey() {
  return Boolean(process.env.XAI_API_KEY)
}

export function xaiModel() {
  return xai.responses(XAI_MODEL)
}

export function xaiImageModel() {
  return xai.image(XAI_IMAGE_MODEL)
}
