import { ShortenedUrlRepositoryImpl } from '@/repositories/shortened-url-repository-impl'
import { verifyUserToken } from '@/services/authUtils'
import { ClickAnalyticsUseCase } from '@/use-cases/click-analytics'
import { Unauthorized } from '@/use-cases/errors/unauthorized'
import { UrlNotExists } from '@/use-cases/errors/url-not-exists'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

export async function clickAnalytics(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const shortCodeSchema = z.object({
    shortCode: z.string(),
  })
  const { shortCode } = shortCodeSchema.parse(request.params)

  try {
    const token = request.headers.authorization?.replace('Bearer ', '') || ''

    const jwtSecret = process.env.JWT_SECRET || ''

    const user = await verifyUserToken({ token, jwtSecret })

    const shortenedUrlRepository = new ShortenedUrlRepositoryImpl()
    const clickAnalyticsUseCase = new ClickAnalyticsUseCase(
      shortenedUrlRepository,
    )

    const analytics = await clickAnalyticsUseCase.execute(
      user.userId,
      shortCode,
    )

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
