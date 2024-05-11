import { PrismaClient, Prisma } from '@prisma/client'
import { ShortenedUrlRepository } from './shortened-url-repository'
import { ShortenedUrl } from '../models/ShortenedUrl'

export class ShortenedUrlRepositoryImpl implements ShortenedUrlRepository {
  findByShortUrl(shortUrl: string): Promise<ShortenedUrl | null> {
    return this.prisma.shortenedUrl.findFirst({
      where: { short_url: shortUrl },
    })
  }

  findByShortId(shortId: string): Promise<ShortenedUrl | null> {
    return this.prisma.shortenedUrl.findFirst({
      where: { id: shortId },
    })
  }

  findAllByUserId(
    userId: string,
    filters: {
      limit?: number
      orderBy?: string
      orderDir?: 'asc' | 'desc'
      dateFrom?: string
      dateTo?: string
    },
  ): Promise<ShortenedUrl[]> {
    const query: Prisma.ShortenedUrlFindManyArgs = {}

    if (filters.dateFrom && filters.dateTo) {
      query.where = {
        created_at: {
          gte: new Date(filters.dateFrom),
          lte: new Date(filters.dateTo),
        },
      }
    } else {
      query.where = { user_id: userId }
    }

    if (filters.orderBy && filters.orderDir) {
      query.orderBy = { [filters.orderBy]: filters.orderDir }
    }

    if (filters.limit) {
      query.take = filters.limit
    }
    return this.prisma.shortenedUrl.findMany(query)
  }

  createShortenedUrl(shortenedUrl: ShortenedUrl): Promise<ShortenedUrl> {
    return this.prisma.shortenedUrl.create({ data: shortenedUrl })
  }

  async incrementClicksAndUpdateDate(shortCode: string): Promise<void> {
    await this.prisma.shortenedUrl.update({
      where: {
        short_url: shortCode,
      },
      data: {
        clicks: {
          increment: 1,
        },
        clickDates: {
          push: new Date(),
        },
      },
    })
  }

  async deleteShortenedUrl(shortCode: string, userId: string): Promise<void> {
    await this.prisma.shortenedUrl.delete({
      where: {
        short_url: shortCode,
        user_id: userId,
      },
    })
  }

  async updateShortenedUrl(
    shortUrlId: string,
    userId: string,
    newValueShortenedUrl: string,
    newValuetitle: string,
  ): Promise<void> {
    await this.prisma.shortenedUrl.update({
      where: {
        id: shortUrlId,
        user_id: userId,
      },
      data: {
        short_url: newValueShortenedUrl,
        title: newValuetitle,
      },
    })
  }

  private prisma: PrismaClient
  constructor() {
    this.prisma = new PrismaClient()
  }
}
