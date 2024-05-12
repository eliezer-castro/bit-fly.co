import { ShortenedUrlRepository } from '@/repositories/shortened-url-repository'
import { UserRepository } from '@/repositories/user-repository'
import { UserNotExists } from './errors/user-not-exists'
import { UrlNotExists } from './errors/url-not-exists'

export class DeleteUrlUseCase {
  // eslint-disable-next-line prettier/prettier
  constructor(private shortenedUrlRepository: ShortenedUrlRepository, private userRepository: UserRepository) { }

  async execute(userId: string, shortUrl: string): Promise<void> {
    const existingUser = await this.userRepository.findById(userId)

    if (!existingUser) {
      throw new UserNotExists()
    }
    const existingShortenedUrl =
      await this.shortenedUrlRepository.findUrlByUserId(userId, shortUrl)

    if (!existingShortenedUrl) {
      throw new UrlNotExists()
    }

    await this.shortenedUrlRepository.deleteUrlByUserId(userId, shortUrl)
  }
}
