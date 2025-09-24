import { InMemoryUserRepository } from '@/repositories/in-memory/in-memory-user-repository'
import { expect, describe, it, beforeEach } from 'vitest'
import { GetUserProfileUseCase } from './get-user-profile-use-case'
import { nanoid } from 'nanoid'
import { UserNotExists } from './errors/user-not-exists-error'

let userRepository: InMemoryUserRepository
let sut: GetUserProfileUseCase

describe('Get User Profile Use Case', () => {
  beforeEach(() => {
    userRepository = new InMemoryUserRepository()
    sut = new GetUserProfileUseCase(userRepository)
  })

  it('should return existing user profile', async () => {
    const user = await userRepository.createUser({
      id: nanoid(),
      name: 'Guilherme Dalastra',
      email: 'ggdalastra@example.com',
      password: '123456',
      created_at: new Date(),
    })

    const retrievedUser = await sut.execute(user.id)

    expect(retrievedUser).toEqual(user)
  })

  it('should throw an error if the user does not exist', async () => {
    const userId = 'invalidUserId'

    await expect(() => sut.execute(userId)).rejects.toThrowError(UserNotExists)
  })
})
