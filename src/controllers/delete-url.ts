import { ShortenedUrlRepositoryImpl } from '@/repositories/shortened-url-repository-impl'
import { UserRepositoryImpl } from '@/repositories/user-repository-impl'
import { DeleteUrlUseCase } from '@/use-cases/delete-url'
import { Unauthorized } from '@/use-cases/errors/unauthorized'
import { UrlNotExists } from '@/use-cases/errors/url-not-exists'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

export async function deleteUrl(request: FastifyRequest, reply: FastifyReply) {
  const deleteUrlSchema = z.object({
    shortCode: z.string(),
  })

  const { shortCode } = deleteUrlSchema.parse(request.query)

  try {
    const shortenedUrlRepository = new ShortenedUrlRepositoryImpl()
    const userRepository = new UserRepositoryImpl()
    const deleteUrlUseCase = new DeleteUrlUseCase(
      shortenedUrlRepository,
      userRepository,
    )

    await deleteUrlUseCase.execute(request.user.sub, shortCode)

    reply.send({ message: 'URL deletada com sucesso' })
  } catch (error) {
    if (error instanceof Unauthorized) {
      return reply.status(404).send({ message: error.message })
    }

    if (error instanceof UrlNotExists) {
      return reply.status(404).send({ message: error.message })
    }
    throw error
  }
}
