import bcrypt from 'bcryptjs'
import { InMemoryUserRepository } from '@/repositories/in-memory/in-memory-user-repository'
import { DeleteUserUseCase } from './delete-user'
import { expect, describe, it, beforeEach } from 'vitest'
import { UserNotExists } from './errors/user-not-exists'
import { InMemoryShortenedUrlRepository } from '@/repositories/in-memory/in-memory-shortened-url-repository'
import { InvalidCredentials } from './errors/invalid-credentials-erros'

let userRepository: InMemoryUserRepository
let shortenedUrlRepository: InMemoryShortenedUrlRepository
let sut: DeleteUserUseCase

describe('Delete User Use Case', () => {
  beforeEach(() => {
    userRepository = new InMemoryUserRepository()
    shortenedUrlRepository = new InMemoryShortenedUrlRepository()
    sut = new DeleteUserUseCase(userRepository, shortenedUrlRepository)
  })

  it('should delete user', async () => {
    const user = await userRepository.createUser({
      id: 'user-id',
      name: 'John Doe',
      email: 'example@example.com',
      password: bcrypt.hashSync('123456', 8),
      created_at: new Date(),
    })

    expect(async () => {
      await sut.execute(user.id, '123456')
    }).not.toThrow()
  })

  it('should delete all user urls', async () => {
    const user = await userRepository.createUser({
      id: 'user-id',
      name: 'John Doe',
      email: 'example@example.com',
      password: bcrypt.hashSync('123456', 8),
      created_at: new Date(),
    })

    await shortenedUrlRepository.createShortenedUrl({
      id: '1',
      title: 'Example',
      long_url: 'http://example.com',
      short_url: 'abc',
      user_id: user.id,
      created_at: new Date(),
    })

    await shortenedUrlRepository.createShortenedUrl({
      id: '2',
      title: 'Example 2',
      long_url: 'http://example2.com',
      short_url: 'def',
      user_id: user.id,
      created_at: new Date(),
    })

    await sut.execute(user.id, '123456')

    const urls = await shortenedUrlRepository.findAllByUserId(user.id)

    expect(urls).toHaveLength(0)

    const deleteUser = await userRepository.findById(user.id)

    expect(deleteUser).toBeNull()
  })

  it('should throw if password is invalid', async () => {
    const user = await userRepository.createUser({
      id: 'user-id',
      name: 'John Doe',
      email: 'example@example.com',
      password: bcrypt.hashSync('123456', 8),
      created_at: new Date(),
    })

    expect(async () => {
      await sut.execute(user.id, 'invalid-password')
    }).rejects.toThrowError(InvalidCredentials)
  })

  it('should throw if user does not exist', async () => {
    expect(async () => {
      await sut.execute('user-id', '123456')
    }).rejects.toThrowError(UserNotExists)
  })
})
