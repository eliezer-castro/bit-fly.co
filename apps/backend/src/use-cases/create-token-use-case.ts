import { TokenRepository } from '@/repositories/token-repository'
import { nanoid } from 'nanoid'

interface TokenUseCaseInterface {
  token: string
  user_id: string
  expires_at: Date
}

interface TokenUseCaseResponse {
  token: string
}

export class CreateTokenUseCase {
  // eslint-disable-next-line prettier/prettier
  constructor(private tokenRepository: TokenRepository) { }

  async execute({
    token,
    user_id,
    expires_at,
  }: TokenUseCaseInterface): Promise<TokenUseCaseResponse> {
    const newToken = await this.tokenRepository.create({
      id: nanoid(),
      token,
      user_id,
      expires_at,
      created_at: new Date(),
    })

    return { token: newToken.token }
  }
}
