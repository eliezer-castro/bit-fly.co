export function generateSlugFromUrl(url: string): string {
  const cleanedUrl = url.trim().replace(/[^a-zA-Z0-9]/g, '')
  const lowercaseUrl = cleanedUrl.toLowerCase()
  const slug = lowercaseUrl.replace(/\s+/g, '-')
  return slug
}
