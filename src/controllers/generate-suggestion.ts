import { FastifyRequest, FastifyReply } from 'fastify'
import { z } from 'zod'
import { UserRepositoryImpl } from '@/repositories/user-repository-impl'
import { ShortenedUrlRepositoryImpl } from '@/repositories/shortened-url-repository-impl'
import { GenerateSuggestion } from '@/use-cases/generate-suggestion'

export async function generateSuggestion(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const generateFriendlyLinkSchema = z.object({
    url: z.string().url(),
    title: z.string().optional(),
    keywords: z.array(z.string()).optional(),
  })

  const { url, title, keywords } = generateFriendlyLinkSchema.parse(
    request.body,
  )

  try {
    const shortenedUrlRepository = new ShortenedUrlRepositoryImpl()
    const userRepository = new UserRepositoryImpl()
    const generateSuggestion = new GenerateSuggestion(
      shortenedUrlRepository,
      userRepository,
    )

    const suggestion = await generateSuggestion.execute(
      request.user.sub,
      title || '',
      url,
      keywords || [],
    )

    reply.status(201).send({
      suggestion: `${request.protocol}://${request.headers.host}/${suggestion}`,
    })
  } catch (error) {
    return reply.status(500).send(error)
  }
}
