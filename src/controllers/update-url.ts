import { ShortenedUrlRepositoryImpl } from '@/repositories/shortened-url-repository-impl'
import { verifyUserToken } from '@/services/authUtils'
import { MissingFields } from '@/use-cases/errors/missing-fields'
import { UrlAlreadtExists } from '@/use-cases/errors/url-already-exists'
import { UrlNotExists } from '@/use-cases/errors/url-not-exists'
import { UpdateShortUrlCaseUse } from '@/use-cases/update-url'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

export async function updateUrl(request: FastifyRequest, reply: FastifyReply) {
  const updateUrlSchema = z.object({
    UrlId: z.string(),
    newShortUrl: z.string().optional(),
    newTitleUrl: z.string().optional(),
  })

  const { UrlId, newShortUrl, newTitleUrl } = updateUrlSchema.parse(
    request.body,
  )

  const token = request.headers.authorization?.replace('Bearer ', '') || ''

  const jwtSecret = process.env.JWT_SECRET || ''

  const user = await verifyUserToken({ token, jwtSecret })

  try {
    const shortenedUrlRepository = new ShortenedUrlRepositoryImpl()
    const registerUseCase = new UpdateShortUrlCaseUse(shortenedUrlRepository)

    await registerUseCase.execute({
      urlId: UrlId,
      userId: user.userId,
      newShortUrl,
      newTitleUrl,
    })

    reply.send({ message: 'URL atualizada com sucesso' })
  } catch (error) {
    if (error instanceof MissingFields) {
      return reply.status(400).send({ message: error.message })
    }

    if (error instanceof UrlNotExists) {
      return reply.status(404).send({ message: error.message })
    }

    if (error instanceof UrlAlreadtExists) {
      return reply.status(409).send({ message: error.message })
    }
    throw error
  }
}
