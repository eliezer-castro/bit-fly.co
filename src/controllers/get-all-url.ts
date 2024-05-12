import { ShortenedUrlRepositoryImpl } from '@/repositories/shortened-url-repository-impl'
import { verifyUserToken } from '@/services/authUtils'
import { GetAllUrlsUseCase } from '@/use-cases/get-all-urls'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

export async function getAllUrls(request: FastifyRequest, reply: FastifyReply) {
  const filter = z.object({
    limit: z.number().optional(),
    orderBy: z.enum(['clicks', 'created_at', 'updated_at']).optional(),
    orderDir: z.enum(['asc', 'desc']).optional(),
    dateFrom: z.string().optional(),
    dateTo: z.string().optional(),
  })

  const { limit, orderBy, orderDir, dateFrom, dateTo } = filter.parse(
    request.query,
  )

  const token = request.headers.authorization?.replace('Bearer ', '') || ''

  const jwtSecret = process.env.JWT_SECRET || ''

  const user = await verifyUserToken({ token, jwtSecret })

  const shortenedUrlRepository = new ShortenedUrlRepositoryImpl()

  const getAllUrlsUseCase = new GetAllUrlsUseCase(shortenedUrlRepository)

  const urls = await getAllUrlsUseCase.execute(user.userId, {
    limit,
    orderBy,
    orderDir,
    dateFrom,
    dateTo,
  })

  reply.send(urls)
}
