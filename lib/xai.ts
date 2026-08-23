import { xai } from '@ai-sdk/xai'

export const XAI_MODEL = 'grok-4.6'

export function hasXaiKey() {
  return Boolean(process.env.XAI_API_KEY)
}

export function xaiModel() {
  return xai.responses(XAI_MODEL)
}
