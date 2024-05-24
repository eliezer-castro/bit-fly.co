import { ShortenedUrl } from '@/models/ShortenedUrl'
import { ShortenedUrlRepository } from '@/repositories/shortened-url-repository'
import { nanoid } from 'nanoid'
import { AliasAlreadyExists } from './errors/alias-already-exists'
import { UniqueShortenedURLGenerator } from '@/services/generateUniqueShortenedURL'

export interface CreateShortUrl {
  url: string
  title?: string
  alias?: string
  userId: string
}
export class CreateShortUrlUseCase {
  constructor(
    private shortenedUrlRepository: ShortenedUrlRepository,
    // eslint-disable-next-line prettier/prettier
  ) { }

  async execute({
    url,
    title,
    alias,
    userId,
  }: CreateShortUrl): Promise<ShortenedUrl> {
    if (alias) {
      const existingAlias =
        await this.shortenedUrlRepository.findByShortUrl(alias)
      if (existingAlias) {
        throw new AliasAlreadyExists()
      }
    }

    const uniqueShortenedURLGenerator = new UniqueShortenedURLGenerator(
      this.shortenedUrlRepository,
    )

    const hash =
      alias || (await uniqueShortenedURLGenerator.generateUniqueShortenedURL())

    const newShortUrl: ShortenedUrl = {
      id: nanoid(),
      long_url: url,
      title: title || '',
      short_url: hash,
      user_id: userId,
    }

    await this.shortenedUrlRepository.createShortenedUrl(newShortUrl)

    return newShortUrl
  }
}
