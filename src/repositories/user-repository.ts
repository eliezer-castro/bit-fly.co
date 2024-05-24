import { User } from '../models/User'

export interface UserRepository {
  findByEmail(email: string): Promise<User | null>
  findById(id: string): Promise<User | null>
  createUser(user: User): Promise<User>
  updateUserProfile(
    userId: string,
    name?: string,
    email?: string,
    password?: string,
  ): Promise<User | null>
}
