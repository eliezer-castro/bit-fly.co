import { FastifyRequest, FastifyReply } from 'fastify'
import { z } from 'zod'
import { verifyUserToken } from '../services/authUtils'
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

  const token = request.headers.authorization?.replace('Bearer ', '') || ''

  const jwtSecret = process.env.JWT_SECRET || ''

  const user = await verifyUserToken({ token, jwtSecret })

  try {
    const shortenedUrlRepository = new ShortenedUrlRepositoryImpl()
    const userRepository = new UserRepositoryImpl()
    const generateSuggestion = new GenerateSuggestion(
      shortenedUrlRepository,
      userRepository,
    )

    const suggestion = await generateSuggestion.execute(
      user.userId,
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
