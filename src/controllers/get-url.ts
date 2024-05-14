import { ShortenedUrlRepositoryImpl } from '@/repositories/shortened-url-repository-impl'
import { UrlNotExists } from '@/use-cases/errors/url-not-exists'
import { GetUrlUseCase } from '@/use-cases/get-url'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

export async function getUrl(request: FastifyRequest, reply: FastifyReply) {
  const getUrlSchema = z.object({
    shortCode: z.string(),
  })

  const { shortCode } = getUrlSchema.parse(request.params)

  try {
    const shortenedUrlRepository = new ShortenedUrlRepositoryImpl()

    const getUrlUseCase = new GetUrlUseCase(shortenedUrlRepository)

    const url = await getUrlUseCase.execute(request.user.sub, shortCode)

    reply.send(url)
  } catch (error) {
    if (error instanceof UrlNotExists) {
      return reply.status(404).send({ message: error.message })
    }
    throw error
  }
}
