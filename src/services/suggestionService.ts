import { GoogleGenerativeAI } from '@google/generative-ai'
import { ShortenedUrlRepository } from '../repositories/shortened-url-repository'

export async function generateSuggestionPrompt(
  title: string,
  url: string,
  keywords: string[],
): Promise<string> {
  if (!process.env.GEMINI_API_KEY) {
    throw new Error('GEMINI_API_KEY não está definido')
  }
  const gemini = new GoogleGenerativeAI(process.env.GEMINI_API_KEY)
  const modelId = 'gemini-pro'
  const model = gemini.getGenerativeModel({ model: modelId })
  const prompt = `Crie um slug curto e fácil de lembrar para um link encurtado. O título do link é '${title}' e o link original é '${url}'. As palavras-chave são '${keywords}'.`

  const result = await model.generateContent(prompt)
  const response = await result.response
  const suggestion = response.text()

  return suggestion
}

export async function getUniqueSuggestion(
  title: string,
  url: string,
  keywords: string[],
  ShortenedUrlRepository: ShortenedUrlRepository,
): Promise<string> {
  const generatedSuggestions = new Set<string>()

  while (true) {
    const suggestion = await generateSuggestionPrompt(title, url, keywords)
    if (
      !generatedSuggestions.has(suggestion) &&
      !(await ShortenedUrlRepository.findByShortUrl(suggestion))
    ) {
      return suggestion
    }
    generatedSuggestions.add(suggestion)
  }
}
