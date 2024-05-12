import { UserRepository } from '@/repositories/user-repository'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { InvalidCredentialsErro } from './errors/invalid-credentials-erros'
import { User } from '@/models/User'

interface LoginUseCaseRequest {
  email: string
  password: string
}

interface LoginUseCaseResponse {
  user: User
  token: string
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

    if (!process.env.JWT_SECRET) {
      throw new Error('JWT_SECRET não está definido')
    }

    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, {
      expiresIn: '1h',
    })
    console.log({ user, token })

    return {
      user,
      token,
    }
  }
}
