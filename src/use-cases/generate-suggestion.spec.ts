import { expect, describe, it, beforeEach } from 'vitest'
import { GenerateSuggestion } from './generate-suggestion'
import { InMemoryShortenedUrlRepository } from '@/repositories/in-memory/in-memory-shortened-url-repository'
import { InMemoryUserRepository } from '@/repositories/in-memory/in-memory-user-repository'
import { Unauthorized } from './errors/unauthorized'

let shortenedUrlRepository: InMemoryShortenedUrlRepository
let userRepository: InMemoryUserRepository
let sut: GenerateSuggestion

describe('Generate Suggestion Use Case', () => {
  beforeEach(() => {
    shortenedUrlRepository = new InMemoryShortenedUrlRepository()
    userRepository = new InMemoryUserRepository()
    sut = new GenerateSuggestion(shortenedUrlRepository, userRepository)
  })

  it('should generate a unique suggestion', async () => {
    const title = 'Example Title'
    const url = 'https://example.com'
    const keywords = ['example', 'keywords']

    const user = await userRepository.createUser({
      id: 'user-id',
      name: 'John Doe',
      email: 'example@example.com',
      password: '123456',
      created_at: new Date(),
    })

    const suggestion = await sut.execute(user.id, title, url, keywords)

    expect(suggestion).toBeDefined()
    expect(await shortenedUrlRepository.findByShortUrl(suggestion)).toBeFalsy()
  })

  it('should throw Unauthorized error if user does not exist', async () => {
    const userId = 'nonExistentUser'
    const title = 'Example Title'
    const url = 'https://example.com'
    const keywords = ['example', 'keywords']

    await expect(() =>
      sut.execute(userId, title, url, keywords),
    ).rejects.toThrowError(Unauthorized)
  })
})
