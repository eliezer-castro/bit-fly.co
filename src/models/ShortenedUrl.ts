export interface ShortenedUrl {
  id: string
  long_url: string
  short_url: string
  clicks?: number
  clickDates?: Date[]
  created_at?: Date
  user_id: string
}
