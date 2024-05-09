import { FastifyRequest, FastifyReply } from 'fastify'
import { z } from 'zod'
import { nanoid } from 'nanoid'
import { verifyToken } from '../services/authUtils'
import { generateUniqueShortenedURL } from '../services/generateUniqueShortenedURL'
import { UserRepository } from '../repositories/UserRepository'
import { ShortenedUrlRepository } from '../repositories/ShortenedUrlRepository'
import { ShortenedUrl } from '../models/ShortenedUrl'

export async function createShortUrl(
  request: FastifyRequest,
  reply: FastifyReply,
  ShortenedUrlRepository: ShortenedUrlRepository,
  UserRepository: UserRepository,
) {
  const urlSchema = z.object({
    url: z.string().url(),
    title: z.string().optional(),
    alias: z.string().optional(),
  })

  const { url, title, alias } = urlSchema.parse(request.body)

  const userId = await verifyToken(request, reply)

  if (!userId) {
    return reply.status(401).send({ error: 'Token não fornecido' })
  }

  if (!url) {
    return reply.status(400).send({ error: 'Url e userId são obrigatórios' })
  }

  const existingUser = await UserRepository.findById(userId)

  if (!existingUser) {
    return reply.status(404).send({ error: 'Usuário não encontrado' })
  }
  if (alias) {
    const existingShortenedUrl =
      await ShortenedUrlRepository.findByShortUrl(alias)
    if (existingShortenedUrl) {
      return reply.status(400).send({ error: 'Alias já existe' })
    }
  }

  const hash = alias || (await generateUniqueShortenedURL())

  const newShortUrl: ShortenedUrl = {
    id: nanoid(),
    long_url: url,
    title: title || '',
    short_url: hash,
    user_id: userId,
  }

  await ShortenedUrlRepository.createShortenedUrl(newShortUrl)

  reply.status(201).send({
    shortUrl: `${request.protocol}://${request.headers.host}/${hash}`,
  })
}

export async function redirectToOriginalUrl(
  request: FastifyRequest,
  reply: FastifyReply,
  ShortenedUrlRepository: ShortenedUrlRepository,
) {
  const redirectSchema = z.object({
    shortCode: z.string(),
  })

  const { shortCode } = redirectSchema.parse(request.params)

  if (!shortCode) {
    return reply.status(400).send({ error: 'URL inválida' })
  }

  const existingShortenedUrl =
    await ShortenedUrlRepository.findByShortUrl(shortCode)

  if (!existingShortenedUrl) {
    return reply.status(404).send({ error: 'URL não encontrada' })
  }

  await ShortenedUrlRepository.incrementClicksAndUpdateDate(shortCode)

  const longUrl = existingShortenedUrl.long_url

  reply.redirect(longUrl)
}

export async function getAllShortUrls(
  request: FastifyRequest,
  reply: FastifyReply,
  ShortenedUrlRepository: ShortenedUrlRepository,
  UserRepository: UserRepository,
) {
  const userId = await verifyToken(request, reply)

  if (!userId) {
    return reply.status(401).send({ error: 'Token não fornecido' })
  }

  const existingUser = await UserRepository.findById(userId)

  if (!existingUser) {
    return reply.status(404).send({ error: 'Usuário não encontrado' })
  }

  const urls = await ShortenedUrlRepository.findAllByUserId(userId)

  reply.send(urls)
}

export async function getShortUrlDetails(
  request: FastifyRequest,
  reply: FastifyReply,
  ShortenedUrlRepository: ShortenedUrlRepository,
  UserRepository: UserRepository,
) {
  const getUrlSchema = z.object({
    shortCode: z.string(),
  })

  const { shortCode } = getUrlSchema.parse(request.query)

  const userId = await verifyToken(request, reply)

  if (!userId) {
    return reply.status(401).send({ error: 'Token não fornecido' })
  }

  if (!shortCode) {
    return reply.status(400).send({ error: 'id e userId são obrigatórios' })
  }
  const existingUser = await UserRepository.findById(userId)

  if (!existingUser) {
    return reply.status(404).send({ error: 'Usuário não encontrado' })
  }

  const existingShortenedUrl =
    await ShortenedUrlRepository.findByShortUrl(shortCode)

  if (!existingShortenedUrl) {
    return reply.status(404).send({ error: 'URL não encontrada' })
  }

  reply.send(existingShortenedUrl)
}

export async function deleteShortUrl(
  request: FastifyRequest,
  reply: FastifyReply,
  ShortenedUrlRepository: ShortenedUrlRepository,
  UserRepository: UserRepository,
) {
  const deleteUrlSchema = z.object({
    shortUrl: z.string(),
  })

  const { shortUrl } = deleteUrlSchema.parse(request.query)
  const userId = await verifyToken(request, reply)

  if (!userId) {
    return reply.status(401).send({ error: 'Token não fornecido' })
  }

  if (!shortUrl) {
    return reply.status(400).send({ error: 'shortUrl é obrigatório' })
  }

  const existingUser = await UserRepository.findById(userId)

  if (!existingUser) {
    return reply.status(404).send({ error: 'Usuário não encontrado' })
  }

  const existingShortenedUrl =
    await ShortenedUrlRepository.findByShortUrl(shortUrl)

  if (!existingShortenedUrl) {
    return reply.status(404).send({ error: 'URL não encontrada' })
  }

  await ShortenedUrlRepository.deleteShortenedUrl(shortUrl, userId)
  reply.send({ message: 'URL deletada com sucesso' })
}

export async function getClickHistory(
  request: FastifyRequest,
  reply: FastifyReply,
  ShortenedUrlRepository: ShortenedUrlRepository,
) {
  const shortCodeSchema = z.object({
    shortCode: z.string(),
  })
  const { shortCode } = shortCodeSchema.parse(request.params)

  if (!shortCode) {
    return reply.status(401).send({ error: 'shortCode não fornecido' })
  }

  const clickHistory = await ShortenedUrlRepository.findByShortUrl(shortCode)

  if (!clickHistory) {
    return reply.status(404).send({ error: 'URL não encontrada' })
  }

  const clickDatesCount: Record<string, number> = {}

  clickHistory.clickDates?.forEach((date) => {
    const dateString = date.toISOString().split('T')[0]
    clickDatesCount[dateString] = (clickDatesCount[dateString] || 0) + 1
  })

  reply.send({
    totalClicks: clickHistory.clicks,
    clickDates: clickDatesCount,
  })
}
