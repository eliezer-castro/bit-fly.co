import { ShortenedUrlRepository } from '@/repositories/shortened-url-repository'
import { UserRepository } from '@/repositories/user-repository'
import { UrlNotExists } from './errors/url-not-exists-error'
import { Unauthorized } from './errors/unauthorized-error'

export class DeleteUrlUseCase {
  // eslint-disable-next-line prettier/prettier
  constructor(private shortenedUrlRepository: ShortenedUrlRepository, private userRepository: UserRepository) { }

  async execute(userId: string, shortCode: string): Promise<void> {
    const existingUser = await this.userRepository.findById(userId)

    if (!existingUser) {
      throw new Unauthorized()
    }

    const existingShortenedUrl =
      await this.shortenedUrlRepository.findUrlByUserId(userId, shortCode)

    if (!existingShortenedUrl) {
      throw new UrlNotExists()
    }

    await this.shortenedUrlRepository.deleteUrlByUserId(userId, shortCode)
  }
}
