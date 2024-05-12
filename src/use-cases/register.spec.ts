/* eslint-disable @typescript-eslint/no-unused-vars */
import { expect, describe, it } from 'vitest'
import { RegisterUseCase } from './register'
import { compare } from 'bcryptjs'
import { InMemoryUserRepository } from '@/repositories/in-memory/in-memory-user-repository'
import { UserAlreadyExists } from './errors/user-already-exists'

describe('Register Use Case', () => {
  it('should be able to register', async () => {
    const userRepository = new InMemoryUserRepository()
    const sut = new RegisterUseCase(userRepository)
    const { user } = await sut.execute({
      name: 'Guilherme Dalastra',
      email: 'ggdalastra@example.com',
      password: '123456',
    })

    expect(user.id).toEqual(expect.any(String))
  })

  it('should hash user password upon registration', async () => {
    const userRepository = new InMemoryUserRepository()

    const registerUseCase = new RegisterUseCase(userRepository)

    const { user } = await registerUseCase.execute({
      name: 'Guilherme Dalastra',
      email: 'ggdalastra@example.com',
      password: '123456',
    })

    const isPasswordHashed = await compare('123456', user.password)

    expect(isPasswordHashed).toBe(true)
  })

  it('Should not be able to register with same email twice', async () => {
    const userRepository = new InMemoryUserRepository()
    const registerUseCase = new RegisterUseCase(userRepository)

    const email = 'johndoe@example.com'

    await registerUseCase.execute({
      name: 'Guilherme Dalastra',
      email,
      password: '123456',
    })

    await expect(() =>
      registerUseCase.execute({
        name: 'John Doe',
        email,
        password: '123456',
      }),
    ).rejects.toBeInstanceOf(UserAlreadyExists)
  })
})
