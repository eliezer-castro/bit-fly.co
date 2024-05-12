import { ShortenedUrlRepository } from '@/repositories/shortened-url-repository'
import { UrlNotExists } from './errors/url-not-exists'
import { InvalidUrl } from './errors/invalid-url'

export class RedirectCaseUse {
  constructor(
    private shortenedUrlRepository: ShortenedUrlRepository,
    // eslint-disable-next-line prettier/prettier
  ) { }

  async execute(slug: string): Promise<string> {
    const shortenedUrl = await this.shortenedUrlRepository.findByShortUrl(slug)

    if (!shortenedUrl) {
      throw new InvalidUrl()
    }

    const existingShortenedUrl =
      await this.shortenedUrlRepository.findByShortUrl(slug)

    if (!existingShortenedUrl) {
      throw new UrlNotExists()
    }

    await this.shortenedUrlRepository.incrementClicksAndUpdateDate(
      existingShortenedUrl.short_url,
    )

    return existingShortenedUrl.long_url
  }
}
