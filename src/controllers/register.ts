import { UserRepositoryImpl } from '@/repositories/user-repository-impl'
import { UserAlreadyExists } from '@/use-cases/errors/user-already-exists'
import { RegisterUseCase } from '@/use-cases/register'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

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
