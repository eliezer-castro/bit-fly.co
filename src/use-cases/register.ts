import bcrypt from 'bcryptjs'
import { nanoid } from 'nanoid'
import { User } from '../models/User'
import { UserAlreadyExists } from './errors/user-already-exists'
import { UserRepository } from '@/repositories/user-repository'

interface RegisterUseCaseInterface {
  name: string
  email: string
  password: string
}

export class RegisterUseCase {
  // eslint-disable-next-line
  constructor(private userRepository: UserRepository) { }

  async execute({ name, email, password }: RegisterUseCaseInterface) {
    const existingUser = await this.userRepository.findByEmail(email)

    if (existingUser) {
      throw new UserAlreadyExists()
    }

    const newUser: User = {
      id: nanoid(),
      name,
      email,
      password: bcrypt.hashSync(password, 8),
      created_at: new Date(),
    }

    await this.userRepository.createUser(newUser)
  }
}
