import { ShortenedUrl } from '@/models/ShortenedUrl'
import { ShortenedUrlRepository } from '@/repositories/shortened-url-repository'
import { UrlNotExists } from './errors/url-not-exists-error'

export class GetUrlUseCase {
  // eslint-disable-next-line prettier/prettier
  constructor(private shortenedUrlRepository: ShortenedUrlRepository) { }

  async execute(usetId: string, shortUrl: string): Promise<ShortenedUrl> {
    const existingShortenedUrl =
      await this.shortenedUrlRepository.findUrlByUserId(usetId, shortUrl)

    if (!existingShortenedUrl) {
      throw new UrlNotExists()
    }

    return existingShortenedUrl
  }
}
