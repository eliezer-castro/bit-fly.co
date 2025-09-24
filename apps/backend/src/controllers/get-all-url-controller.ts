import { ShortenedUrlRepositoryImpl } from '@/repositories/shortened-url-repository-impl'
import { GetAllUrlsUseCase } from '@/use-cases/get-all-urls-use-case'
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

  const shortenedUrlRepository = new ShortenedUrlRepositoryImpl()

  const getAllUrlsUseCase = new GetAllUrlsUseCase(shortenedUrlRepository)

  const urls = await getAllUrlsUseCase.execute(request.user.sub, {
    limit,
    orderBy,
    orderDir,
    dateFrom,
    dateTo,
  })

  reply.send(urls)
}
