import { PrismaClient } from '@prisma/client'
import crypto from 'crypto'

const prisma = new PrismaClient()

function generateRandomHash(hashLength: number): string {
  const allowedCharacters =
    'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
  let hash = ''
  for (let i = 0; i < hashLength; i++) {
    const randomIndex = Math.floor(
      (crypto.randomBytes(1)[0] / 256) * allowedCharacters.length,
    )
    hash += allowedCharacters[randomIndex]
  }
  return hash
}

async function isHashUnique(hash: string) {
  try {
    const existingShortenedUrl = await prisma.shortenedUrl.findUnique({
      where: {
        short_url: hash,
      },
    })
    return existingShortenedUrl === null
  } catch (error) {
    console.error('Error querying the database: ', error)
    throw error
  }
}

export async function generateUniqueShortenedURL(
  retries = 10,
): Promise<string> {
  const hashLength = 7

  for (let attempt = 0; attempt < retries; attempt++) {
    const hash = generateRandomHash(hashLength)
    if (await isHashUnique(hash)) {
      return hash
    }
  }

  throw new Error(
    'Failed to generate unique shortened URL after maximum retries',
  )
}
