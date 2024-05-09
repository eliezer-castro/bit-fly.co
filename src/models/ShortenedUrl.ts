export interface ShortenedUrl {
  id: string
  long_url: string
  title: string
  short_url: string
  clicks?: number
  clickDates?: Date[]
  created_at?: Date
  updated_at?: Date | null
  user_id: string
}
