import { expect, describe, it, beforeEach } from 'vitest'
import { ClickAnalyticsUseCase } from './click-analytics'
import { InMemoryShortenedUrlRepository } from '@/repositories/in-memory/in-memory-shortened-url-repository'
import { Unauthorized } from './errors/unauthorized'
import { UrlNotExists } from './errors/url-not-exists'

let shortenedUrlRepository: InMemoryShortenedUrlRepository
let sut: ClickAnalyticsUseCase

describe('Click Analytics Use Case', () => {
  beforeEach(() => {
    shortenedUrlRepository = new InMemoryShortenedUrlRepository()
    sut = new ClickAnalyticsUseCase(shortenedUrlRepository)
  })

  it('should return click analytics for authorized user and existing URL', async () => {
    const userId = 'user123'
    const shortCode = 'abc123'
    const clickDate = new Date('2024-05-13')

    await shortenedUrlRepository.createShortenedUrl({
      id: 'short-url-id',
      title: 'Example',
      short_url: shortCode,
      long_url: 'https://example.com/original-url',
      clicks: 5,
      clickDates: [clickDate],
      user_id: userId,
      created_at: new Date(),
      updated_at: new Date(),
    })

    const analytics = await sut.execute(userId, shortCode)

    expect(analytics.totalClicks).toEqual(5)
    expect(analytics.clickDates).toHaveProperty('2024-05-13', 1)
  })

  it('should throw Unauthorized error if user is not authorized to access URL analytics', async () => {
    const userId = 'user123'
    const shortCode = 'abc123'

    await shortenedUrlRepository.createShortenedUrl({
      id: 'short-url-id',
      title: 'Example',
      short_url: shortCode,
      long_url: 'https://example.com/original-url',
      clicks: 5,
      user_id: 'differentUser',
      created_at: new Date(),
      updated_at: new Date(),
    })

    await expect(() => sut.execute(userId, shortCode)).rejects.toThrowError(
      Unauthorized,
    )
  })

  it('should throw UrlNotExists error if the URL does not exist', async () => {
    const userId = 'user123'
    const shortCode = 'invalidShortCode'

    await expect(() => sut.execute(userId, shortCode)).rejects.toThrowError(
      UrlNotExists,
    )
  })
})
