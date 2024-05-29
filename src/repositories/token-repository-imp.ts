import { PrismaClient } from '@prisma/client'
import { Token } from '@/models/token'
import { TokenRepository } from './token-repository'

export class TokenRepositoryImpl implements TokenRepository {
  create(token: Token): Promise<Token> {
    return this.prisma.token.create({
      data: {
        token: token.token,
        user_id: token.user_id,
        expires_at: token.expires_at,
        created_at: token.created_at,
      },
    })
  }

  findByToken(token: string): Promise<Token | null> {
    return this.prisma.token.findFirst({
      where: {
        token,
      },
    })
  }

  async delete(token: string): Promise<void> {
    await this.prisma.token.deleteMany({
      where: {
        token,
      },
    })
  }

  findByUserId(user_id: string): Promise<Token[]> {
    return this.prisma.token.findMany({
      where: {
        user_id,
      },
    })
  }

  private prisma: PrismaClient

  constructor() {
    this.prisma = new PrismaClient()
  }
}
