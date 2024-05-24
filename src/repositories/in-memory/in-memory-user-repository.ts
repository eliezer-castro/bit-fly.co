import { User } from '@/models/User'
import { UserRepository } from '../user-repository'

export class InMemoryUserRepository implements UserRepository {
  public items: User[] = []

  async findByEmail(email: string): Promise<User | null> {
    const user = this.items.find((user) => user.email === email)

    return user || null
  }

  async findById(id: string): Promise<User | null> {
    const user = this.items.find((user) => user.id === id)

    return user || null
  }

  async createUser(data: User): Promise<User> {
    const user = {
      id: data.id,
      name: data.name,
      email: data.email,
      password: data.password,
      created_at: new Date(),
    }

    this.items.push(user)

    return user
  }

  updateUserProfile(
    userId: string,
    name?: string | undefined,
    email?: string | undefined,
    password?: string | undefined,
  ): Promise<User | null> {
    const user = this.items.find((user) => user.id === userId)

    if (!user) {
      return Promise.resolve(null)
    }

    if (name) {
      user.name = name
    }

    if (email) {
      user.email = email
    }

    if (password) {
      user.password = password
    }

    return Promise.resolve(user)
  }
}
