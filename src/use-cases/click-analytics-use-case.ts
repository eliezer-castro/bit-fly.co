import { ClickAnalytics } from '@/models/click-analytics'
import { ShortenedUrlRepository } from '@/repositories/shortened-url-repository'
import { UrlNotExists } from './errors/url-not-exists-error'

export class ClickAnalyticsUseCase {
  // eslint-disable-next-line prettier/prettier
  constructor(private shortenedUrlRepository: ShortenedUrlRepository) { }

  async execute(userId: string, id: string): Promise<ClickAnalytics> {
    const shortenedUrl = await this.shortenedUrlRepository.findUrlByUserId(
      userId,
      id,
    )
    if (!shortenedUrl) {
      throw new UrlNotExists()
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
