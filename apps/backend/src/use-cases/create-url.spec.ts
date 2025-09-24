import { InMemoryShortenedUrlRepository } from '@/repositories/in-memory/in-memory-shortened-url-repository'
import { describe, it, expect, beforeEach } from 'vitest'
import { CreateShortUrlUseCase } from './create-url-use-case'
import { AliasAlreadyExists } from './errors/alias-already-exists-error'

let shortnedUrlRepository: InMemoryShortenedUrlRepository
let sut: CreateShortUrlUseCase

describe('Create URL Use Case', () => {
  beforeEach(() => {
    shortnedUrlRepository = new InMemoryShortenedUrlRepository()
    sut = new CreateShortUrlUseCase(shortnedUrlRepository)
  })

  it('should be able to create a new shortened URL', async () => {
    const url = await sut.execute({
      userId: 'user-id',
      url: 'https://example.com',
    })

    expect(url.id).toEqual(expect.any(String))
  })

  it('should be able to create a new shortened URL with a custom alias', async () => {
    const url = await sut.execute({
      userId: 'user-id',
      url: 'https://example.com',
      alias: 'example',
    })
    expect(url.short_url).toEqual('example')
  })

  it('should not be able to create a new shortened URL with an already existing alias', async () => {
    await sut.execute({
      userId: 'user-id',
      url: 'https://example.com',
      alias: 'example',
    })

    expect(async () => {
      await sut.execute({
        userId: 'user-id',
        url: 'https://example.com',
        alias: 'example',
      })
    }).rejects.toThrowError(AliasAlreadyExists)
  })

  it('should be able to create a new shortened URL with a custom title', async () => {
    const url = await sut.execute({
      userId: 'user-id',
      url: 'https://example.com',
      title: 'Example',
    })

    expect(url.title).toEqual('Example')
  })
})
