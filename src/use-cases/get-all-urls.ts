import { ShortenedUrl } from '@/models/ShortenedUrl'
import { ShortenedUrlRepository } from '@/repositories/shortened-url-repository'

interface GetAllUrls {
  limit?: number
  orderBy?: 'clicks' | 'created_at' | 'updated_at'
  orderDir?: 'asc' | 'desc'
  dateFrom?: string
  dateTo?: string
}

export class GetAllUrlsUseCase {
  // eslint-disable-next-line prettier/prettier
  constructor(private shortenedUrlRepository: ShortenedUrlRepository) { }

  async execute(userId: string, options: GetAllUrls): Promise<ShortenedUrl[]> {
    const { limit, orderBy, orderDir, dateFrom, dateTo } = options

    return this.shortenedUrlRepository.findAllByUserId(userId, {
      limit,
      orderBy,
      orderDir,
      dateFrom,
      dateTo,
    })
  }
}
