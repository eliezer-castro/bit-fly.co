import { PrismaClient } from '@prisma/client'
import { UserRepository } from './user-repository'
import { User } from '../models/User'

export class UserRepositoryImpl implements UserRepository {
  findByEmail(email: string): Promise<User | null> {
    return this.prisma.user.findFirst({ where: { email } })
  }

  findById(id: string): Promise<User | null> {
    return this.prisma.user.findFirst({ where: { id } })
  }

  createUser(user: User): Promise<User> {
    return this.prisma.user.create({ data: user })
  }

  async updateUserProfile(
    userId: string,
    name?: string,
    email?: string,
    password?: string,
  ): Promise<User | null> {
    const user = await this.prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        name,
        email,
        password,
      },
    })

    return user
  }

  private prisma: PrismaClient

  constructor() {
    this.prisma = new PrismaClient()
  }
}
