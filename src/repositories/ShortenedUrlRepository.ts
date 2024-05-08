import { ShortenedUrl } from '../models/ShortenedUrl'

export interface ShortenedUrlRepository {
  findByShortUrl(shortUrl: string): Promise<ShortenedUrl | null>
  createShortenedUrl(shortenedUrl: ShortenedUrl): Promise<ShortenedUrl>
  incrementClicksAndUpdateDate(shortCode: string): Promise<void>
  findAllByUserId(userId: string): Promise<ShortenedUrl[]>
  deleteShortenedUrl(shortCode: string, userId: string): Promise<void>
}
