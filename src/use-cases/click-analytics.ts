import { ClickAnalytics } from '@/models/click-analytics'
import { ShortenedUrlRepository } from '@/repositories/shortened-url-repository'
import { Unauthorized } from './errors/unauthorized'
import { UrlNotExists } from './errors/url-not-exists'

export class ClickAnalyticsUseCase {
  // eslint-disable-next-line prettier/prettier
  constructor(private shortenedUrlRepository: ShortenedUrlRepository) { }

  async execute(userId: string, shortCode: string): Promise<ClickAnalytics> {
    const shortenedUrl =
      await this.shortenedUrlRepository.findByShortUrl(shortCode)
    if (!shortenedUrl) {
      throw new UrlNotExists()
    }
    if (shortenedUrl.user_id !== userId) {
      throw new Unauthorized()
    }

    const clickDatesCount: Record<string, number> = {}

    shortenedUrl.clickDates?.forEach((date) => {
      const dateString = date.toISOString().split('T')[0]
      clickDatesCount[dateString] = (clickDatesCount[dateString] || 0) + 1
    })
    return {
      totalClicks: shortenedUrl.clicks || 0,
      clickDates: clickDatesCount,
    }
  }
}
