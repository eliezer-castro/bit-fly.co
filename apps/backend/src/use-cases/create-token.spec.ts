import { InMemoryTokenRepository } from '@/repositories/in-memory/in-memory-token-repository'
import { expect, describe, it, beforeEach } from 'vitest'
import { CreateTokenUseCase } from './create-token-use-case'
import { Token } from '@/models/token'

let tokenRepository: InMemoryTokenRepository
let sut: CreateTokenUseCase

describe('Create Token Use Case', () => {
  beforeEach(() => {
    tokenRepository = new InMemoryTokenRepository()
    sut = new CreateTokenUseCase(tokenRepository)
  })

  it('should be able to create a token', async () => {
    const token: Token = {
      id: 'token-id',
      token: 'refreshToken',
      user_id: 'user-id',
      created_at: new Date(),
      expires_at: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7),
    }
    await sut.execute(token)

    const refreshToken = await tokenRepository.findByToken('refreshToken')

    expect(refreshToken).toBeDefined()
    expect(refreshToken?.token).toEqual('refreshToken')
  })
})
