import crypto from 'crypto'
import { ShortenedUrlRepository } from '@/repositories/shortened-url-repository'

export class UniqueShortenedURLGenerator {
  // eslint-disable-next-line prettier/prettier
  constructor(private shortenedUrlRepository: ShortenedUrlRepository) { }

  private generateRandomHash(hashLength: number): string {
    const allowedCharacters =
      'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
    let hash = ''
    for (let i = 0; i < hashLength; i++) {
      const randomIndex = Math.floor(
        (crypto.randomBytes(1)[0] / 256) * allowedCharacters.length,
      )
      hash += allowedCharacters[randomIndex]
    }
    return hash
  }

  private async isHashUnique(hash: string) {
    try {
      const existingShortenedUrl =
        await this.shortenedUrlRepository.findByShortUrl(hash)
      return existingShortenedUrl === null
    } catch (error) {
      console.error('Error querying the database: ', error)
      throw error
    }
  }

  public async generateUniqueShortenedURL(retries = 10): Promise<string> {
    const hashLength = 7

    for (let attempt = 0; attempt < retries; attempt++) {
      const hash = this.generateRandomHash(hashLength)
      if (await this.isHashUnique(hash)) {
        return hash
      }
    }

    throw new Error(
      'Failed to generate unique shortened URL after maximum retries',
    )
  }
}
