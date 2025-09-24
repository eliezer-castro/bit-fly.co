import { Token } from '@/models/token'
import { TokenRepository } from '../token-repository'

export class InMemoryTokenRepository implements TokenRepository {
  private tokens: Token[] = []

  async findByToken(token: string): Promise<Token | null> {
    return this.tokens.find((t) => t.token === token) || null
  }

  async findByUserId(user_id: string): Promise<Token[]> {
    return this.tokens.filter((t) => t.user_id === user_id)
  }

  async create(token: Token): Promise<Token> {
    this.tokens.push(token)
    return token
  }

  async delete(token: string): Promise<void> {
    this.tokens = this.tokens.filter((t) => t.token !== token)
  }
}
