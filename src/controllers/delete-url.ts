import { ShortenedUrlRepositoryImpl } from '@/repositories/shortened-url-repository-impl'
import { UserRepositoryImpl } from '@/repositories/user-repository-impl'
import { verifyUserToken } from '@/services/authUtils'
import { DeleteUrlUseCase } from '@/use-cases/delete-url'
import { UrlNotExists } from '@/use-cases/errors/url-not-exists'
import { UserNotExists } from '@/use-cases/errors/user-not-exists'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

export async function deleteUrl(request: FastifyRequest, reply: FastifyReply) {
  const deleteUrlSchema = z.object({
    shortCode: z.string(),
  })

  const { shortCode } = deleteUrlSchema.parse(request.query)

  const token = request.headers.authorization?.replace('Bearer ', '') || ''

  const jwtSecret = process.env.JWT_SECRET || ''

  const user = await verifyUserToken({ token, jwtSecret })

  try {
    const shortenedUrlRepository = new ShortenedUrlRepositoryImpl()
    const userRepository = new UserRepositoryImpl()
    const deleteUrlUseCase = new DeleteUrlUseCase(
      shortenedUrlRepository,
      userRepository,
    )

    await deleteUrlUseCase.execute(user.userId, shortCode)

    reply.send({ message: 'URL deletada com sucesso' })
  } catch (error) {
    if (error instanceof UserNotExists) {
      return reply.status(404).send({ message: error.message })
    }

    if (error instanceof UrlNotExists) {
      return reply.status(404).send({ message: error.message })
    }
    throw error
  }
}
