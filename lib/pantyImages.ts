/**
 * Panty imagery: cut illustrations (front · back · fabric detail) generated per
 * colourway under /public/images/products/panties/. Swap for photography by
 * replacing the files or uploading images in the admin desk.
 */
export function pantyImages(slug: string, hex: string): string[] {
  const key = hex.replace('#', '').toLowerCase()
  return [1, 2, 3].map((n) => `/images/products/panties/${slug}-${key}-${n}.svg`)
}
