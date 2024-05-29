import { UserRepository } from '@/repositories/user-repository'
import bcrypt from 'bcryptjs'
import { InvalidCredentials } from './errors/invalid-credentials-error'
import { User } from '@/models/User'

interface LoginUseCaseRequest {
  email: string
  password: string
}

interface LoginUseCaseResponse {
  user: User
}

export class AuthUseCase {
  // eslint-disable-next-line prettier/prettier
  constructor(private userRepository: UserRepository) { }

  async execute({
    email,
    password,
  }: LoginUseCaseRequest): Promise<LoginUseCaseResponse> {
    const user = await this.userRepository.findByEmail(email)

    if (!user) {
      throw new InvalidCredentials()
    }

    const doesPasswordMatches = bcrypt.compareSync(password, user.password)

    if (!doesPasswordMatches) {
      throw new InvalidCredentials()
    }

    return {
      user,
    }
  }
}
