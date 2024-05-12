import { ShortenedUrl } from '../models/ShortenedUrl'

export interface ShortenedUrlRepository {
  findByShortUrl(shortUrl: string): Promise<ShortenedUrl | null>
  findUrlByUserId(
    userId: string,
    shortUrl: string,
  ): Promise<ShortenedUrl | null>
  findAllByUserId(
    userId: string,
    filters: {
      limit?: number
      orderBy?: string
      orderDir?: 'asc' | 'desc'
      dateFrom?: string
      dateTo?: string
    },
  ): Promise<ShortenedUrl[]>
  findByShortId(shortId: string): Promise<ShortenedUrl | null>
  createShortenedUrl(shortenedUrl: ShortenedUrl): Promise<ShortenedUrl>
  incrementClicksAndUpdateDate(shortCode: string): Promise<void>
  deleteUrlByUserId(userId: string, shortCode: string): Promise<void>
  updateShortenedUrl(
    urlId: string,
    userId: string,
    newShortUrl: string,
    newTitleUrl: string,
  ): Promise<ShortenedUrl>
}
