import { InMemoryUserRepository } from '@/repositories/in-memory/in-memory-user-repository'
import { describe, expect, it, beforeEach } from 'vitest'
import { UpdateUserProfileUseCase } from './update-profile'
import { InvalidEmail } from './errors/invalid-email'
import { EmailAlreadyExists } from './errors/email-already-exists'
import { UserNotExists } from './errors/user-not-exists'
import { InvalidPassword } from './errors/invalid-password'

let userRepository: InMemoryUserRepository
let sut: UpdateUserProfileUseCase

describe('Update User Profile Use Case', () => {
  beforeEach(() => {
    userRepository = new InMemoryUserRepository()
    sut = new UpdateUserProfileUseCase(userRepository)
  })

  it('should be able to update a user profile', async () => {
    await userRepository.createUser({
      id: 'user-id',
      name: 'John Doe',
      email: 'john-doe@mail.com',
      password: 'password',
      created_at: new Date(),
    })

    const { name } = await sut.execute({
      userId: 'user-id',
      name: 'Jane Doe',
      email: 'jane-doe@mail.com',
    })

    expect(name).toEqual('Jane Doe')
  })

  it('should not be able to update a user profile with invalid email', async () => {
    const userId = 'user-id'

    await userRepository.createUser({
      id: userId,
      name: 'John Doe',
      email: 'John-doe@mail.com',
      password: 'password',
      created_at: new Date(),
    })

    expect(async () => {
      await sut.execute({
        userId,
        email: 'jane-doe',
      })
    }).rejects.toThrow(InvalidEmail)
  })

  it('should not be able to update a user profile with an already existing email', async () => {
    await userRepository.createUser({
      id: '1',
      name: 'John Doe',
      email: 'john-doe@mail.com',
      password: 'password',
      created_at: new Date(),
    })
    await userRepository.createUser({
      id: '2',
      name: 'Jane Doe',
      email: 'jane-doe@mail.com',
      password: 'password',
      created_at: new Date(),
    })

    expect(async () => {
      await sut.execute({
        userId: '1',
        email: 'jane-doe@mail.com',
      })
    }).rejects.toThrow(EmailAlreadyExists)
  })

  it('should not be able to update a user profile that does not exist', async () => {
    expect(async () => {
      await sut.execute({
        userId: 'user-id',
        email: 'john-doe@mail.com',
      })
    }).rejects.toThrow(UserNotExists)
  })

  // invalid password
  it('should not be able to update a user profile with invalid password', async () => {
    await userRepository.createUser({
      id: '1',
      name: 'John Doe',
      email: 'john-doe@mail.com',
      password: 'password',
      created_at: new Date(),
    })

    expect(async () => {
      await sut.execute({
        userId: '1',
        currentPassword: 'invalid-password',
        password: 'new-password',
      })
    }).rejects.toThrow(InvalidPassword)
  })
})
