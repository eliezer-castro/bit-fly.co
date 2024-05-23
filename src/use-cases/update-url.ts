import { ShortenedUrl } from '@/models/ShortenedUrl'
import { ShortenedUrlRepository } from '@/repositories/shortened-url-repository'
import { MissingFields } from './errors/missing-fields'
import { UrlNotExists } from './errors/url-not-exists'
import { generateSlugFromUrl } from '@/services/generate-slug'
import { AliasAlreadyExists } from './errors/alias-already-exists'

export interface UpdateShortUrl {
  urlId: string
  userId: string
  short_url?: string
  title?: string
}

export class UpdateShortUrlCaseUse {
  constructor(
    private shortenedUrlRepository: ShortenedUrlRepository,
    // eslint-disable-next-line prettier/prettier
  ) { }


  async execute({
    urlId,
    userId,
    short_url,
    title,
  }: UpdateShortUrl): Promise<ShortenedUrl> {
    if (!short_url && !title) {
      throw new MissingFields()
    }

    let slug = ''

    const existingShortenedUrl =
      await this.shortenedUrlRepository.findByShortId(urlId)

    if (!existingShortenedUrl) {
      throw new UrlNotExists()
    }

    if (short_url) {
      slug = generateSlugFromUrl(short_url)

      const existingUrl = await this.shortenedUrlRepository.findByShortUrl(slug)
      if (existingUrl) {
        throw new AliasAlreadyExists()
      }
    }

    const _url = short_url || existingShortenedUrl.short_url
    const _title = title || existingShortenedUrl.title

    const returnUpdateShortUrl =
      await this.shortenedUrlRepository.updateShortenedUrl(
        urlId,
        userId,
        slug || _url,
        _title,
      )

    return returnUpdateShortUrl
  }
}
