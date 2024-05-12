import { describe, it, expect, beforeEach } from 'vitest'
import { UpdateShortUrlCaseUse } from './update-url'
import { InMemoryShortenedUrlRepository } from '@/repositories/in-memory/in-memory-shortened-url-repository'
import { AliasAlreadyExists } from './errors/alias-already-exists'

let shortnedUrlRepository: InMemoryShortenedUrlRepository
let sut: UpdateShortUrlCaseUse

describe('Update URL Use Case', () => {
  beforeEach(() => {
    shortnedUrlRepository = new InMemoryShortenedUrlRepository()
    sut = new UpdateShortUrlCaseUse(shortnedUrlRepository)
  })

  it('should be able to update a shortened URL', async () => {
    await shortnedUrlRepository.createShortenedUrl({
      id: 'shortened-url-id',
      user_id: 'user-id',
      long_url: 'https://example.com',
      short_url: 'example',
      title: 'Example',
    })

    const { short_url, title } = await sut.execute({
      urlId: 'shortened-url-id',
      userId: 'user-id',
      newShortUrl: 'new-example',
      newTitleUrl: 'New Example',
    })

    expect(short_url).toEqual('new-example')
    expect(title).toEqual('New Example')
  })

  it('should not be able to update a shortened URL with an already existing alias', async () => {
    await shortnedUrlRepository.createShortenedUrl({
      id: 'shortened-url-id',
      user_id: 'user-id',
      long_url: 'https://example.com',
      short_url: 'example',
      title: 'Example',
    })

    await shortnedUrlRepository.createShortenedUrl({
      id: 'shortened-url-id-2',
      user_id: 'user-id',
      long_url: 'https://example.com',
      short_url: 'new-example',
      title: 'New Example',
    })

    expect(async () => {
      await sut.execute({
        urlId: 'shortened-url-id',
        userId: 'user-id',
        newShortUrl: 'new-example',
        newTitleUrl: 'New Example',
      })
    }).rejects.toThrowError(AliasAlreadyExists)
  })
})
