import { InMemoryTokenRepository } from '@/repositories/in-memory/in-memory-token-repository'
import { expect, describe, it, beforeEach } from 'vitest'
import { RefreshTokenUseCase } from './refresh-token-use-case'
import { Token } from '@/models/token'
import { InvalidRefreshToken } from './errors/invalid-refresh-token'

let tokenRepository: InMemoryTokenRepository

let sut: RefreshTokenUseCase

describe('Refresh Token Use Case', () => {
  beforeEach(() => {
    tokenRepository = new InMemoryTokenRepository()
    sut = new RefreshTokenUseCase(tokenRepository)
  })

  it('should be able to refresh a token', async () => {
    const refreshToken: Token = {
      id: 'token-id',
      token: 'old-token',
      user_id: 'user-id',
      created_at: new Date(),
      expires_at: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7),
    }

    await tokenRepository.create(refreshToken)

    await sut.execute({
      oldToken: refreshToken.token,
      refreshToken: 'new-token',
    })

    const newRefreshToken = await tokenRepository.findByToken('new-token')

    expect(newRefreshToken).toBeDefined()
    expect(newRefreshToken?.token).toEqual('new-token')
    expect(newRefreshToken?.user_id).toEqual('user-id')
  })

  it('should not be able to refresh a token with invalid refresh token', async () => {
    expect(async () => {
      await sut.execute({
        oldToken: 'invalid',
        refreshToken: 'new-token',
      })
    }).rejects.toThrowError(InvalidRefreshToken)
  })

  it('should throw an error if the old token is expired', async () => {
    const refreshToken: Token = {
      id: 'token-id',
      token: 'new-refresh-token',
      user_id: 'user-id',
      created_at: new Date(),
      expires_at: new Date(Date.now() - 1000 * 60 * 60),
    }

    await tokenRepository.create(refreshToken)

    expect(async () => {
      await sut.execute({
        oldToken: refreshToken.token,
        refreshToken: 'new-token',
      })
    }).rejects.toThrowError(InvalidRefreshToken)
  })

  it('should delete the old token after refreshing', async () => {
    const refreshToken: Token = {
      id: 'token-id',
      token: 'refresh-token',
      user_id: 'user-id',
      created_at: new Date(),
      expires_at: new Date(Date.now() + 1000 * 60 * 60 * 24),
    }

    await tokenRepository.create(refreshToken)

    await sut.execute({
      oldToken: refreshToken.token,
      refreshToken: 'new-refresh-token',
    })

    const oldStoredToken = await tokenRepository.findByToken(refreshToken.token)

    expect(oldStoredToken).toBeNull()
  })
})
