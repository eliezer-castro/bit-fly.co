import { InMemoryUserRepository } from '@/repositories/in-memory/in-memory-user-repository'
import { describe, expect, it, beforeEach } from 'vitest'
import { UpdateUserProfileUseCase } from './update-profile-use-case'
import { InvalidEmail } from './errors/invalid-email-error'
import { EmailAlreadyExists } from './errors/email-already-exists-error'
import { UserNotExists } from './errors/user-not-exists-error'
import { InvalidPassword } from './errors/invalid-password-error'
import { MissingFields } from './errors/missing-fields-error'

let userRepository: InMemoryUserRepository
let sut: UpdateUserProfileUseCase

describe('Update User Profile Use Case', () => {
  beforeEach(() => {
    userRepository = new InMemoryUserRepository()
    sut = new UpdateUserProfileUseCase(userRepository)
  })

  it('should be able to update both name and email', async () => {
    await userRepository.createUser({
      id: 'user-id',
      name: 'John Doe',
      email: 'john-doe@mail.com',
      password: 'password',
      created_at: new Date(),
    })

    const { name, email } = await sut.execute({
      userId: 'user-id',
      name: 'Jane Doe',
      email: 'jane-doe@mail.com',
    })

    expect(name).toEqual('Jane Doe')
    expect(email).toEqual('jane-doe@mail.com')
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

  it('should be able to update both name and email', async () => {
    await userRepository.createUser({
      id: 'user-id',
      name: 'John Doe',
      email: 'john-doe@mail.com',
      password: 'password',
      created_at: new Date(),
    })

    const { email } = await sut.execute({
      userId: 'user-id',
      name: 'Jane Doe',
    })

    expect(email).toEqual('john-doe@mail.com')
  })

  it('should not update name if no new name is provided', async () => {
    await userRepository.createUser({
      id: 'user-id',
      name: 'John Doe',
      email: 'john-doe@mail.com',
      password: 'password',
      created_at: new Date(),
    })

    const { name } = await sut.execute({
      userId: 'user-id',
      email: 'jane-doe@mail.com',
    })

    expect(name).toEqual('John Doe')
  })

  it('should not update any field if no update data is provided', async () => {
    await userRepository.createUser({
      id: 'user-id',
      name: 'John Doe',
      email: 'john-doe@mail.com',
      password: 'password',
      created_at: new Date(),
    })

    expect(async () => {
      await sut.execute({
        userId: 'user-id',
      })
    }).rejects.toThrow(MissingFields)
  })
})
