import { ShortenedUrlRepository } from '@/repositories/shortened-url-repository'
import { InvalidUrl } from './errors/invalid-url-error'

export class RedirectCaseUse {
  constructor(
    private shortenedUrlRepository: ShortenedUrlRepository,
    // eslint-disable-next-line prettier/prettier
  ) { }

  async execute(slug: string): Promise<string> {
    const url = await this.shortenedUrlRepository.findByShortUrl(slug)
    if (!url) {
      throw new InvalidUrl()
    }
    await this.shortenedUrlRepository.incrementClicksAndUpdateDate(
      url.short_url,
    )
    return url.long_url
  }
}
