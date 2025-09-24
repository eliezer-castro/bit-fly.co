import { expect, describe, it, beforeEach } from 'vitest'
import { RedirectCaseUse } from './redirect-use-case'
import { InMemoryShortenedUrlRepository } from '@/repositories/in-memory/in-memory-shortened-url-repository'
import { InvalidUrl } from './errors/invalid-url-error'

let shortenedUrlRepository: InMemoryShortenedUrlRepository
let sut: RedirectCaseUse

describe('Redirect Use Case', () => {
  beforeEach(() => {
    shortenedUrlRepository = new InMemoryShortenedUrlRepository()
    sut = new RedirectCaseUse(shortenedUrlRepository)
  })

  it('should throw InvalidUrl if url does not exist', async () => {
    await expect(sut.execute('example')).rejects.toThrow(InvalidUrl)
  })

  it('should return original url', async () => {
    const url = await shortenedUrlRepository.createShortenedUrl({
      id: 'short-url-id',
      long_url: 'https://example.com',
      short_url: 'example',
      title: 'Example',
      user_id: 'user-id',
      created_at: new Date(),
    })

    const originalUrl = await sut.execute(url.short_url)
    expect(originalUrl).toBe(url.long_url)
  })

  it('should increment clicks and update date', async () => {
    const url = await shortenedUrlRepository.createShortenedUrl({
      id: 'short-url-id',
      long_url: 'https://example.com',
      short_url: 'example',
      title: 'Example',
      user_id: 'user-id',
      created_at: new Date(),
    })

    await sut.execute(url.short_url)
    const updatedUrl = await shortenedUrlRepository.findByShortUrl(
      url.short_url,
    )
    expect(updatedUrl?.clicks).toBe(1)
  })
})
