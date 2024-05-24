import { UserRepository } from '@/repositories/user-repository'
import { MissingFields } from './errors/missing-fields'
import { UserNotExists } from './errors/user-not-exists'
import { EmailAlreadyExists } from './errors/email-already-exists' // Nova importação
import bcrypt from 'bcryptjs'
import { InvalidEmail } from './errors/invalid-email'
import { InvalidPassword } from './errors/invalid-password'

export interface UpdateUserProfile {
  userId: string
  name?: string
  email?: string
  currentPassword?: string
  password?: string
}

interface UpdateUserProfileUseCaseResponse {
  id: string
  name: string
  email: string
  password: string
}

export class UpdateUserProfileUseCase {
  // eslint-disable-next-line prettier/prettier
  constructor(private userRepository: UserRepository) { }

  async execute({
    userId,
    name,
    email,
    currentPassword,
    password,
  }: UpdateUserProfile): Promise<UpdateUserProfileUseCaseResponse> {
    if (!name && !email && !currentPassword && !password) {
      throw new MissingFields()
    }

    const user = await this.userRepository.findById(userId)

    if (!user) {
      throw new UserNotExists()
    }

    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      throw new InvalidEmail()
    }

    if (email) {
      const existingEmail = await this.userRepository.findByEmail(email)
      if (existingEmail && existingEmail.id !== userId) {
        throw new EmailAlreadyExists()
      }
    }

    const updatedName = name || user.name
    const updatedEmail = email || user.email
    let updatedPassword = user.password

    if (password) {
      if (!currentPassword) {
        throw new MissingFields()
      }

      const isCurrentPasswordValid = bcrypt.compareSync(
        currentPassword,
        user.password,
      )

      if (!isCurrentPasswordValid) {
        throw new InvalidPassword()
      }

      updatedPassword = bcrypt.hashSync(password, 8)
    }

    try {
      const user = await this.userRepository.updateUserProfile(
        userId,
        updatedName,
        updatedEmail,
        updatedPassword,
      )

      if (!user) {
        throw new UserNotExists()
      }

      return user
    } catch (error) {
      console.error('Erro ao atualizar perfil do usuário:', error)
      throw new Error('Não foi possível atualizar o perfil do usuário')
    }
  }
}
