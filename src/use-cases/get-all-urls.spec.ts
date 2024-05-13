import { expect, describe, it, beforeEach } from 'vitest'
import { GetAllUrlsUseCase } from './get-all-urls'
import { InMemoryShortenedUrlRepository } from '@/repositories/in-memory/in-memory-shortened-url-repository'
import { ShortenedUrl } from '@/models/ShortenedUrl'

let shortenedUrlRepository: InMemoryShortenedUrlRepository
let sut: GetAllUrlsUseCase

describe('Get All URLs Use Case', () => {
  beforeEach(() => {
    shortenedUrlRepository = new InMemoryShortenedUrlRepository()
    sut = new GetAllUrlsUseCase(shortenedUrlRepository)
  })

  it('should return all URLs for a given user', async () => {
    const userId = 'user123'

    const urls: ShortenedUrl[] = [
      {
        id: 'url1',
        title: 'Example 1',
        short_url: 'abc123',
        long_url: 'https://example.com/original-url1',
        clicks: 5,
        user_id: userId,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id: 'url2',
        title: 'Example 2',
        short_url: 'def456',
        long_url: 'https://example.com/original-url2',
        clicks: 10,
        user_id: userId,
        created_at: new Date(),
        updated_at: new Date(),
      },
    ]

    for (const url of urls) {
      await shortenedUrlRepository.createShortenedUrl(url)
    }

    const retrievedUrls = await sut.execute(userId, {})

    expect(retrievedUrls).toEqual(urls)
  })

  // Implement method in inMemoryShortenedUrlRepository.ts
  it.skip('should return URLs ordered by clicks in descending order', async () => {
    const userId = 'user123'

    const urls: ShortenedUrl[] = [
      {
        id: 'url1',
        title: 'Example 1',
        short_url: 'abc123',
        long_url: 'https://example.com/original-url1',
        clicks: 5,
        user_id: userId,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id: 'url2',
        title: 'Example 2',
        short_url: 'def456',
        long_url: 'https://example.com/original-url2',
        clicks: 10,
        user_id: userId,
        created_at: new Date(),
        updated_at: new Date(),
      },
    ]

    for (const url of urls) {
      await shortenedUrlRepository.createShortenedUrl(url)
    }

    const retrievedUrls = await sut.execute(userId, {
      orderBy: 'clicks',
      orderDir: 'desc',
    })

    expect(retrievedUrls[0].short_url).toEqual('def456')
    expect(retrievedUrls[1].short_url).toEqual('abc123')
  })
})
