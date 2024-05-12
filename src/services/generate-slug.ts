export function generateSlugFromUrl(slug: string): string {
  const trimmedSlug = slug.trim()
  if (/^[a-zA-Z0-9-]+$/.test(trimmedSlug)) {
    return trimmedSlug
  }
  const cleanedUrl = trimmedSlug.replace(/[^a-zA-Z0-9\s-]/g, '')
  const lowercaseUrl = cleanedUrl.toLowerCase()
  const format = lowercaseUrl.replace(/\s+/g, '-')
  return format
}
