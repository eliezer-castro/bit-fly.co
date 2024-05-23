import { ShortenedUrlRepositoryImpl } from '@/repositories/shortened-url-repository-impl'
import { AliasAlreadyExists } from '@/use-cases/errors/alias-already-exists'
import { MissingFields } from '@/use-cases/errors/missing-fields'
import { UrlNotExists } from '@/use-cases/errors/url-not-exists'
import { UpdateShortUrlCaseUse } from '@/use-cases/update-url'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

export async function updateUrl(request: FastifyRequest, reply: FastifyReply) {
  const updateBodySchema = z.object({
    short_url: z.string().optional(),
    title: z.string().optional(),
  })

  const updateParamsSchema = z.object({
    id: z.string(),
  })

  const { short_url, title } = updateBodySchema.parse(request.body)
  const { id } = updateParamsSchema.parse(request.params)

  try {
    const shortenedUrlRepository = new ShortenedUrlRepositoryImpl()
    const registerUseCase = new UpdateShortUrlCaseUse(shortenedUrlRepository)

    await registerUseCase.execute({
      urlId: id,
      userId: request.user.sub,
      short_url,
      title,
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
