/* eslint-disable @typescript-eslint/no-unused-vars */
import { expect, describe, it } from 'vitest'
import bcrypt from 'bcryptjs'
import { InMemoryUserRepository } from '@/repositories/in-memory/in-memory-user-repository'
import { LoginUseCase } from './login'
import dotenv from 'dotenv'
import { InvalidCredentialsErro } from './errors/invalid-credentials-erros'
dotenv.config()

describe('Login Use Case', () => {
  it('should be able to login', async () => {
    const userRepository = new InMemoryUserRepository()
    const sut = new LoginUseCase(userRepository)

    await userRepository.createUser({
      id: '1',
      name: 'Guilherme Dalastra',
      email: 'ggdalastra@example.com',
      password: bcrypt.hashSync('123456', 8),
      created_at: new Date(),
    })

    const { user } = await sut.execute({
      email: 'ggdalastra@example.com',
      password: '123456',
    })

    expect(user.id).toEqual(expect.any(String))
  })

  it('should not be able to login with invalid credentials', async () => {
    const userRepository = new InMemoryUserRepository()
    const sut = new LoginUseCase(userRepository)

    await userRepository.createUser({
      id: '1',
      name: 'Guilherme Dalastra',
      email: 'ggdalastra@example.com',
      password: bcrypt.hashSync('123456', 8),
      created_at: new Date(),
    })

    expect(async () => {
      await sut.execute({
        email: 'gdalastra@example.com',
        password: '123123',
      })
    }).rejects.toThrowError(InvalidCredentialsErro)
  })
})
