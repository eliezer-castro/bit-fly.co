import { ShortenedUrlRepositoryImpl } from '@/repositories/shortened-url-repository-impl'
import { UserRepositoryImpl } from '@/repositories/user-repository-impl'
import { verifyUserToken } from '@/services/authUtils'
import { CreateShortUrlUseCase } from '@/use-cases/create-url'
import { AliasAlreadyExists } from '@/use-cases/errors/alias-already-exists'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

export async function createUrl(request: FastifyRequest, reply: FastifyReply) {
  const urlSchema = z.object({
    url: z.string().url(),
    title: z.string().optional(),
    alias: z.string().optional(),
  })

  try {
    const { url, title, alias } = urlSchema.parse(request.body)

    const token = request.headers.authorization?.replace('Bearer ', '') || ''

    const jwtSecret = process.env.JWT_SECRET || ''

    const user = await verifyUserToken({ token, jwtSecret })

    const userRepository = new UserRepositoryImpl()
    const shortenedUrlRepository = new ShortenedUrlRepositoryImpl()
    const registerUseCase = new CreateShortUrlUseCase(
      userRepository,
      shortenedUrlRepository,
    )

    const data = await registerUseCase.execute({
      url,
      title,
      alias,
      userId: user.userId,
    })
    reply.status(201).send({
      shortUrl: `${request.protocol}://${request.headers.host}/${data.short_url}`,
    })
  } catch (error) {
    if (error instanceof AliasAlreadyExists) {
      return reply.status(409).send({ message: error.message })
    }
    throw error
  }
}
