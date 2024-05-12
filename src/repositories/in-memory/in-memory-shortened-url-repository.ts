import { ShortenedUrl } from '@/models/ShortenedUrl'
import { ShortenedUrlRepository } from '../shortened-url-repository'

export class InMemoryShortenedUrlRepository implements ShortenedUrlRepository {
  private urls: ShortenedUrl[] = []

  async findByShortUrl(shortUrl: string): Promise<ShortenedUrl | null> {
    return this.urls.find((url) => url.short_url === shortUrl) || null
  }

  async findByShortId(shortId: string): Promise<ShortenedUrl | null> {
    return this.urls.find((url) => url.id === shortId) || null
  }

  async findAllByUserId(userId: string): Promise<ShortenedUrl[]> {
    return this.urls.filter((url) => url.user_id === userId)
  }

  async createShortenedUrl(shortenedUrl: ShortenedUrl): Promise<ShortenedUrl> {
    this.urls.push(shortenedUrl)
    return shortenedUrl
  }

  async incrementClicksAndUpdateDate(shortCode: string): Promise<void> {
    const url = this.urls.find((url) => url.short_url === shortCode)
    if (url) {
      url.clicks = url.clicks || 0
      url.clicks++
      url.clickDates = url.clickDates || []
      url.clickDates.push(new Date())
    }
  }

  async deleteUrlByUserId(userId: string, shortUrl: string): Promise<void> {
    this.urls = this.urls.filter(
      (url) => !(url.user_id === userId && url.short_url === shortUrl),
    )
  }

  async updateShortenedUrl(
    urlId: string,
    userId: string,
    newShortUrl?: string,
    newTitleUrl?: string,
  ): Promise<ShortenedUrl> {
    const urlIndex = this.urls.findIndex(
      (url) => url.id === urlId && url.user_id === userId,
    )
    if (urlIndex !== -1) {
      this.urls[urlIndex].short_url =
        newShortUrl !== undefined ? newShortUrl : this.urls[urlIndex].short_url
      this.urls[urlIndex].title =
        newTitleUrl !== undefined ? newTitleUrl : this.urls[urlIndex].title
      return this.urls[urlIndex]
    }
    throw new Error('ShortenedUrl not found')
  }

  async findUrlByUserId(
    userId: string,
    shortUrl: string,
  ): Promise<ShortenedUrl | null> {
    return (
      this.urls.find(
        (url) => url.user_id === userId && url.short_url === shortUrl,
      ) || null
    )
  }
}
