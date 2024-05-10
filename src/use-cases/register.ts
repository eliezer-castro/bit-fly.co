import bcrypt from 'bcryptjs'
import { nanoid } from 'nanoid'
import { UserRepositoryImpl } from '../repositories/UserRepositoryImpl'
import { User } from '../models/User'
import { UserAlreadyExists } from './errors/user-already-exists'

interface RegisterUseCaseInterface {
  name: string
  email: string
  password: string
}

export async function registerUseCase({
  name,
  email,
  password,
}: RegisterUseCaseInterface) {
  const userRepositoryImpl = new UserRepositoryImpl()

  const existingUser = await userRepositoryImpl.findByEmail(email)

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

  await userRepositoryImpl.createUser(newUser)
}
