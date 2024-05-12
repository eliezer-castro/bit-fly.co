import { ShortenedUrlRepository } from '@/repositories/shortened-url-repository'
import { UserRepository } from '@/repositories/user-repository'
import { generateSuggestionPrompts } from '@/services/suggestionService'
import { Unauthorized } from './errors/unauthorized'

export class GenerateSuggestion {
  // eslint-disable-next-line prettier/prettier
  constructor(private shortenedUrlRepository: ShortenedUrlRepository, private userRepository: UserRepository) { }
  async execute(
    userId: string,
    title: string,
    url: string,
    keywords: string[],
  ): Promise<string> {
    const generatedSuggestions = new Set<string>()

    const existingUser = await this.userRepository.findById(userId)

    if (!existingUser) {
      throw new Unauthorized()
    }

    while (true) {
      const suggestion = await generateSuggestionPrompts(title, url, keywords)
      if (
        !generatedSuggestions.has(suggestion) &&
        !(await this.shortenedUrlRepository.findByShortUrl(suggestion))
      ) {
        return suggestion
      }
      generatedSuggestions.add(suggestion)
    }
  }
}
