import { ShortenedUrl } from '@/models/ShortenedUrl'
import { ShortenedUrlRepository } from '@/repositories/shortened-url-repository'
import { MissingFields } from './errors/missing-fields'
import { UrlNotExists } from './errors/url-not-exists'
import { UrlAlreadtExists } from './errors/url-already-exists'
import { generateSlugFromUrl } from '@/services/generate-slug'

export interface UpdateShortUrl {
  urlId: string
  userId: string
  newShortUrl?: string
  newTitleUrl?: string
}

export class UpdateShortUrlCaseUse {
  constructor(
    private shortenedUrlRepository: ShortenedUrlRepository,
    // eslint-disable-next-line prettier/prettier
  ) { }


  async execute({
    urlId,
    userId,
    newShortUrl,
    newTitleUrl,
  }: UpdateShortUrl): Promise<ShortenedUrl> {
    if (!newShortUrl && !newTitleUrl) {
      throw new MissingFields()
    }

    let slug = ''

    const existingShortenedUrl =
      await this.shortenedUrlRepository.findByShortId(urlId)

    if (!existingShortenedUrl) {
      throw new UrlNotExists()
    }

    if (newShortUrl) {
      slug = generateSlugFromUrl(newShortUrl)

      const existingUrl = await this.shortenedUrlRepository.findByShortUrl(slug)
      if (existingUrl) {
        throw new UrlAlreadtExists()
      }
    }

    const url = newShortUrl || existingShortenedUrl.short_url
    const title = newTitleUrl || existingShortenedUrl.title

    const returnUpdateShortUrl =
      await this.shortenedUrlRepository.updateShortenedUrl(
        urlId,
        userId,
        slug || url,
        title,
      )

    return returnUpdateShortUrl
  }
}
