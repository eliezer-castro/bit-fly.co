import { Token } from '@/models/token'

export interface TokenRepository {
  create(token: Token): Promise<Token>
  findByToken(token: string): Promise<Token | null>
  findByUserId(user_id: string): Promise<Token[]>
  delete(token: string): Promise<void>
}
