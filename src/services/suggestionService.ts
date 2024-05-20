import { GoogleGenerativeAI } from '@google/generative-ai'
import dotenv from 'dotenv'

dotenv.config()

if (!process.env.GEMINI_API_KEY) {
  throw new Error('GEMINI_API_KEY não está definido')
}

const gemini = new GoogleGenerativeAI(process.env.GEMINI_API_KEY)
const modelId = 'gemini-pro'
const model = gemini.getGenerativeModel({ model: modelId })

function createPrompt(title: string, url: string, keywords: string[]): string {
  return `
    Título: ${title}
    url: ${url}
    Palavras-chave: ${keywords.join(', ')}
    ---
    com base nessas informações, gere um 'slug' a partir do título, url e palavras-chave fornecidos, o slug deve ser curto, descritiva e amigável para o usuário.

    Exemplo de Entrada:

    Título: "Receita de bolo de chocolate"
    Descrição: "Aprenda a fazer um delicioso bolo de chocolate em casa"
    Palavras-chave: "bolo, chocolate, receita, culinária, sobremesa"

    Exemplo de saída: "receita-bolo-chocolate"
  `
}

export async function generateSuggestionPrompts(
  title: string,
  url: string,
  keywords: string[],
): Promise<string> {
  const prompt = createPrompt(title, url, keywords)

  try {
    const result = await model.generateContent(prompt)
    const response = await result.response
    const suggestion = response.text()
    return suggestion
  } catch (error) {
    console.error('Error generating content: ', error)
    throw error
  }
}
