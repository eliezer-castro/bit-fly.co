import { expect, describe, it, beforeEach } from 'vitest'
import { GetUrlUseCase } from './get-url'
import { InMemoryShortenedUrlRepository } from '@/repositories/in-memory/in-memory-shortened-url-repository'
import { UrlNotExists } from './errors/url-not-exists'
import { ShortenedUrl } from '@/models/ShortenedUrl'

let shortenedUrlRepository: InMemoryShortenedUrlRepository
let sut: GetUrlUseCase

describe('Get URL Use Case', () => {
  beforeEach(() => {
    shortenedUrlRepository = new InMemoryShortenedUrlRepository()
    sut = new GetUrlUseCase(shortenedUrlRepository)
  })

  it('should return existing shortened URL for a given user', async () => {
    const userId = 'user123'
    const shortUrl = 'abc123'
    const expectedShortenedUrl: ShortenedUrl = {
      id: '1',
      title: 'Example Title',
      short_url: shortUrl,
      long_url: 'https://example.com/original-url',
      clicks: 5,
      user_id: userId,
      created_at: new Date(),
      updated_at: new Date(),
    }

    await shortenedUrlRepository.createShortenedUrl(expectedShortenedUrl)

    const retrievedShortenedUrl = await sut.execute(userId, shortUrl)

    expect(retrievedShortenedUrl).toEqual(expectedShortenedUrl)
  })

  it('should throw UrlNotExists error if the URL does not exist for the user', async () => {
    const userId = 'user123'
    const shortUrl = 'invalidShortUrl'

    await expect(() => sut.execute(userId, shortUrl)).rejects.toThrowError(
      UrlNotExists,
    )
  })
})
