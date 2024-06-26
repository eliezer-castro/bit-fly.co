import { ShortenedUrlRepositoryImpl } from '@/repositories/shortened-url-repository-impl'
import { ClickAnalyticsUseCase } from '@/use-cases/click-analytics-use-case'
import { Unauthorized } from '@/use-cases/errors/unauthorized-error'
import { UrlNotExists } from '@/use-cases/errors/url-not-exists-error'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

export async function clickAnalytics(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const shortCodeSchema = z.object({
    id: z.string(),
  })
  const { id } = shortCodeSchema.parse(request.params)

  try {
    const shortenedUrlRepository = new ShortenedUrlRepositoryImpl()
    const clickAnalyticsUseCase = new ClickAnalyticsUseCase(
      shortenedUrlRepository,
    )

    const analytics = await clickAnalyticsUseCase.execute(request.user.sub, id)

    reply.send(analytics)
  } catch (error) {
    if (error instanceof UrlNotExists) {
      return reply.status(404).send({ message: error.message })
    }

    if (error instanceof Unauthorized) {
      return reply.status(401).send({ message: error.message })
    }
    throw error
  }
}
