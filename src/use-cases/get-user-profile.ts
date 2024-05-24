import { User } from '@/models/User'
import { UserNotExists } from './errors/user-not-exists'
import { UserRepository } from '@/repositories/user-repository'

export class GetUserProfileUseCase {
  // eslint-disable-next-line prettier/prettier
  constructor(private userRepository: UserRepository) { }

  async execute(userId: string): Promise<User> {
    const existingUser = await this.userRepository.findById(userId)

    if (!existingUser) {
      throw new UserNotExists()
    }

    return existingUser
  }
}
