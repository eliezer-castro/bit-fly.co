import { ShortenedUrlRepositoryImpl } from '@/repositories/shortened-url-repository-impl'
import { InvalidUrl } from '@/use-cases/errors/invalid-url'
import { RedirectCaseUse } from '@/use-cases/redirect'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

export async function redirect(request: FastifyRequest, reply: FastifyReply) {
  const redirectSchema = z.object({
    shortCode: z.string(),
  })

  const { shortCode } = redirectSchema.parse(request.params)

  try {
    const shortenedUrlRepository = new ShortenedUrlRepositoryImpl()
    const redirectCaseUse = new RedirectCaseUse(shortenedUrlRepository)

    const originalUrl = await redirectCaseUse.execute(shortCode)

    reply.redirect(originalUrl)
  } catch (error) {
    if (error instanceof InvalidUrl) {
      return reply.status(400).send({ message: error.message })
    }
    throw error
  }
}
