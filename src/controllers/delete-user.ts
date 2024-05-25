import { ShortenedUrlRepositoryImpl } from '@/repositories/shortened-url-repository-impl'
import { UserRepositoryImpl } from '@/repositories/user-repository-impl'
import { DeleteUserUseCase } from '@/use-cases/delete-user'
import { InvalidCredentials } from '@/use-cases/errors/invalid-credentials-erros'
import { UserNotExists } from '@/use-cases/errors/user-not-exists'
import { FastifyReply, FastifyRequest } from 'fastify'

import { z } from 'zod'

export async function deleteUser(request: FastifyRequest, reply: FastifyReply) {
  const deleteUserBodySchema = z.object({
    password: z.string(),
  })

  const { password } = deleteUserBodySchema.parse(request.body)

  try {
    const shortenedUrlRepository = new ShortenedUrlRepositoryImpl()
    const userRepository = new UserRepositoryImpl()
    const deleteUserUseCase = new DeleteUserUseCase(
      userRepository,
      shortenedUrlRepository,
    )

    await deleteUserUseCase.execute(request.user.sub, password)

    reply.send({ message: 'Usuário deletado com sucesso' })
  } catch (error) {
    if (error instanceof InvalidCredentials) {
      return reply.status(401).send({ message: error.message })
    }

    if (error instanceof UserNotExists) {
      return reply.status(404).send({ message: error.message })
    }
    throw error
  }
}
