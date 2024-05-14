import { UserRepository } from '@/repositories/user-repository'
import bcrypt from 'bcryptjs'
import { InvalidCredentialsErro } from './errors/invalid-credentials-erros'
import { User } from '@/models/User'

interface LoginUseCaseRequest {
  email: string
  password: string
}

interface LoginUseCaseResponse {
  user: User
}

export class LoginUseCase {
  // eslint-disable-next-line
  constructor(private userRepository: UserRepository) { }

  async execute({
    email,
    password,
  }: LoginUseCaseRequest): Promise<LoginUseCaseResponse> {
    const user = await this.userRepository.findByEmail(email)

    if (!user) {
      throw new InvalidCredentialsErro()
    }

    const doesPasswordMatches = bcrypt.compareSync(password, user.password)

    if (!doesPasswordMatches) {
      throw new InvalidCredentialsErro()
    }

    return {
      user,
    }
  }
}
