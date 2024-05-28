import { TokenRepository } from '@/repositories/token-repository'
import { InvalidRefreshToken } from './errors/invalid-refresh-token'
import { nanoid } from 'nanoid'

interface RefreshTokenUseCaseRequest {
  oldToken: string
  refreshToken: string
}

export class RefreshTokenUseCase {
  // eslint-disable-next-line prettier/prettier
  constructor(private tokenRepository: TokenRepository) { }

  async execute({
    oldToken,
    refreshToken,
  }: RefreshTokenUseCaseRequest): Promise<void> {
    const storedToken = await this.tokenRepository.findByToken(oldToken)

    if (!storedToken || new Date() > storedToken.expires_at) {
      await this.tokenRepository.delete(oldToken)
      throw new InvalidRefreshToken()
    }

    await this.tokenRepository.delete(oldToken)

    await this.tokenRepository.create({
      id: nanoid(),
      created_at: new Date(),
      user_id: storedToken.user_id,
      token: refreshToken,
      expires_at: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7),
    })
  }
}
