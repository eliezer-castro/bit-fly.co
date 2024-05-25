import bcrypt from 'bcryptjs'
import { UserRepository } from '@/repositories/user-repository'
import { UserNotExists } from './errors/user-not-exists'
import { InvalidCredentials } from './errors/invalid-credentials-erros'
import { ShortenedUrlRepository } from '@/repositories/shortened-url-repository'

export class DeleteUserUseCase {
  // eslint-disable-next-line prettier/prettier
  constructor(private userRepository: UserRepository, private shortenedUrlRepository: ShortenedUrlRepository) { }



  async execute(userId: string, password: string): Promise<void> {
    const user = await this.userRepository.findById(userId)

    if (!user) {
      throw new UserNotExists()
    }

    const isPasswordValid = bcrypt.compareSync(password, user.password)

    if (!isPasswordValid) {
      throw new InvalidCredentials()
    }

    await this.shortenedUrlRepository.deleteManyUrlsByUserId(userId)

    await this.userRepository.deleteUser(userId)
  }
}
