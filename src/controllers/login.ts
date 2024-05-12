import { UserRepositoryImpl } from '@/repositories/user-repository-impl'
import { InvalidCredentialsErro } from '@/use-cases/errors/invalid-credentials-erros'
import { LoginUseCase } from '@/use-cases/login'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

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
    if (error instanceof InvalidCredentialsErro) {
      return reply.status(404).send({ message: error.message })
    }
    if (error instanceof InvalidCredentialsErro) {
      return reply.status(401).send({ message: error.message })
    }
    throw error
  }
}
