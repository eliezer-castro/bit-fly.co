import { PrismaClient } from '@prisma/client'
import crypto from 'crypto'

const prisma = new PrismaClient()

function generateRandomHash(hashLength: number): string {
  const randomBytes = crypto.randomBytes(hashLength)
  const hash = randomBytes.toString('hex')
  return hash.slice(0, hashLength)
}

async function isHashUnique(hash: string) {
  const existingShortenedUrl = await prisma.shortenedUrl.findUnique({
    where: {
      short_url: hash,
    },
  })
  return !existingShortenedUrl
}

export async function generateUniqueShortenedURL(): Promise<string> {
  let hash: string
  const hashLength = 7

  do {
    hash = generateRandomHash(hashLength)
  } while (!(await isHashUnique(hash)))

  return hash
}
