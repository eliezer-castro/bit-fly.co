import { InMemoryShortenedUrlRepository } from '@/repositories/in-memory/in-memory-shortened-url-repository'
import { InMemoryUserRepository } from '@/repositories/in-memory/in-memory-user-repository'
import { describe, it, expect, beforeEach } from 'vitest'
import { DeleteUrlUseCase } from './delete-url-use-case'
import { Unauthorized } from './errors/unauthorized-error'
import { UrlNotExists } from './errors/url-not-exists-error'

let shortnedUrlRepository: InMemoryShortenedUrlRepository
let userRepository: InMemoryUserRepository
let sut: DeleteUrlUseCase

describe('Delete Url Use Case ', () => {
  beforeEach(() => {
    shortnedUrlRepository = new InMemoryShortenedUrlRepository()
    userRepository = new InMemoryUserRepository()
    sut = new DeleteUrlUseCase(shortnedUrlRepository, userRepository)
  })
  it('should throw Unauthorized if user does not exist', async () => {
    await expect(sut.execute('user-id', 'example')).rejects.toThrow(
      Unauthorized,
    )
  })

  it('should throw UrlNotExists if url does not exist', async () => {
    const user = await userRepository.createUser({
      id: 'user-id',
      name: 'John Doe',
      email: 'example@example.com',
      password: '123456',
      created_at: new Date(),
    })

    expect(async () => {
      await sut.execute(user.id, 'example')
    }).rejects.toThrowError(UrlNotExists)
  })

  it('should delete url', async () => {
    const user = await userRepository.createUser({
      id: 'user-id',
      name: 'John Doe',
      email: 'example@example.com',
      password: '123456',
      created_at: new Date(),
    })

    const url = await shortnedUrlRepository.createShortenedUrl({
      id: 'short-url-id',
      long_url: 'https://example.com',
      short_url: 'example',
      title: 'Example',
      user_id: user.id,
      created_at: new Date(),
    })

    expect(async () => {
      await sut.execute(user.id, url.short_url)
    }).not.toThrow()
  })
})
