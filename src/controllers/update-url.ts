import { ShortenedUrlRepositoryImpl } from '@/repositories/shortened-url-repository-impl'
import { AliasAlreadyExists } from '@/use-cases/errors/alias-already-exists'
import { MissingFields } from '@/use-cases/errors/missing-fields'
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

  try {
    const shortenedUrlRepository = new ShortenedUrlRepositoryImpl()
    const registerUseCase = new UpdateShortUrlCaseUse(shortenedUrlRepository)

    await registerUseCase.execute({
      urlId: UrlId,
      userId: request.user.sub,
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

    if (error instanceof AliasAlreadyExists) {
      return reply.status(409).send({ message: error.message })
    }
    throw error
  }
}
