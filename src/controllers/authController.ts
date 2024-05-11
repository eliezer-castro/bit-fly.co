import { FastifyRequest, FastifyReply } from 'fastify'
import { z } from 'zod'
import { UserAlreadyExists } from '../use-cases/errors/user-already-exists'
import { RegisterUseCase } from '../use-cases/register'
import { LoginUseCase } from '../use-cases/login'
import { UserNotExists } from '../use-cases/errors/user-not-exists'
import { InvalidPassword } from '../use-cases/errors/invalidPassword'
import { UserRepositoryImpl } from '@/repositories/user-repository-impl'

export async function registerUser(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const userSchema = z.object({
    name: z.string(),
    email: z.string().email(),
    password: z.string().min(6),
  })

  const { name, email, password } = userSchema.parse(request.body)

  try {
    const userRepository = new UserRepositoryImpl()
    const registerUseCase = new RegisterUseCase(userRepository)
    await registerUseCase.execute({ name, email, password })
    reply.status(201).send({ message: 'Usuário criado com sucesso' })
  } catch (error) {
    if (error instanceof UserAlreadyExists) {
      return reply.status(409).send({ message: error.message })
    }

    throw error
  }
}

export async function loginUser(request: FastifyRequest, reply: FastifyReply) {
  const loginSchema = z.object({
    email: z.string().email(),
    password: z.string().min(6),
  })

  const { email, password } = loginSchema.parse(request.body)

  try {
    const userRepository = new UserRepositoryImpl()
    const loginUseCase = new LoginUseCase(userRepository)
    const login = await loginUseCase.execute({ email, password })
    reply.status(200).send({ token: login })
  } catch (error) {
    if (error instanceof UserNotExists) {
      return reply.status(404).send({ message: error.message })
    }
    if (error instanceof InvalidPassword) {
      return reply.status(401).send({ message: error.message })
    }
    throw error
  }
}
