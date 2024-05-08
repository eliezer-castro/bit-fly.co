import { FastifyRequest, FastifyReply } from 'fastify'
import { z } from 'zod'
import { prisma } from '../../lib/prisma'
import { nanoid } from 'nanoid'
import { verifyToken } from '../../helpers/authUtils'
import { generateUniqueShortenedURL } from '../../helpers/generateUniqueShortenedURL'

export async function createShortUrl(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const urlSchema = z.object({
    url: z.string().url(),
    customAlias: z.string().optional(),
  })

  const { url, customAlias } = urlSchema.parse(request.body)

  const userId = await verifyToken(request, reply)

  if (!userId) {
    return reply.status(401).send({ error: 'Token não fornecido' })
  }

  if (!url) {
    return reply.status(400).send({ error: 'Url e userId são obrigatórios' })
  }

  if (customAlias) {
    const aliasExists = await prisma.shortenedUrl.findFirst({
      where: {
        short_url: customAlias,
      },
    })

    if (aliasExists) {
      return reply.status(409).send({ error: 'Alias já existe' })
    }
  }

  if (userId) {
    const userExists = await prisma.user.findFirst({
      where: {
        id: userId,
      },
    })

    if (!userExists) {
      return reply.status(404).send({ error: 'Usuário não encontrado' })
    }
  }

  const hash = customAlias || (await generateUniqueShortenedURL())

  await prisma.shortenedUrl.create({
    data: {
      id: nanoid(),
      long_url: url,
      short_url: hash,
      user_id: userId,
    },
  })

  reply.status(201).send({
    shortUrl: `${request.protocol}://${request.headers.host}/${hash}`,
  })
}

export async function redirectToOriginalUrl(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const redirectSchema = z.object({
    shortCode: z.string(),
  })

  const { shortCode } = redirectSchema.parse(request.params)

  if (!shortCode) {
    return reply.status(400).send({ error: 'URL inválida' })
  }

  const url = await prisma.shortenedUrl.findFirst({
    where: {
      short_url: shortCode,
    },
  })

  if (!url) {
    return reply.status(404).send({ error: 'URL não encontrada' })
  }

  await prisma.shortenedUrl.update({
    where: {
      short_url: shortCode,
    },
    data: {
      clicks: {
        increment: 1,
      },
      clickDates: {
        push: new Date(),
      },
    },
  })
  reply.redirect(url.long_url)
}

export async function getAllShortUrls(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const userId = await verifyToken(request, reply)

  if (!userId) {
    return reply.status(401).send({ error: 'Token não fornecido' })
  }

  const user = await prisma.user.findFirst({
    where: {
      id: userId,
    },
  })

  if (!user) {
    return reply.status(404).send({ error: 'Usuário não encontrado' })
  }

  const urls = await prisma.shortenedUrl.findMany({
    where: {
      user_id: userId,
    },
  })

  reply.send(urls)
}

export async function getShortUrlDetails(
  request: FastifyRequest,
  reply: FastifyReply,
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

  const user = await prisma.user.findFirst({
    where: {
      id: userId,
    },
  })

  if (!user) {
    return reply.status(404).send({ error: 'Usuário não encontrado' })
  }

  const url = await prisma.shortenedUrl.findFirst({
    where: {
      short_url: shortCode,
      user_id: userId,
    },
  })

  if (!url) {
    return reply.status(404).send({ error: 'URL não encontrada' })
  }

  reply.send(url)
}

export async function deleteShortUrl(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const deleteUrlSchema = z.object({
    urlId: z.string(),
  })

  const { urlId } = deleteUrlSchema.parse(request.query)
  const userId = await verifyToken(request, reply)

  if (!userId) {
    return reply.status(401).send({ error: 'Token não fornecido' })
  }

  if (!urlId) {
    return reply.status(400).send({ error: 'urlId é obrigatório' })
  }

  const user = await prisma.user.findFirst({
    where: {
      id: userId,
    },
  })

  if (!user) {
    return reply.status(404).send({ error: 'Usuário não encontrado' })
  }

  const url = await prisma.shortenedUrl.findFirst({
    where: {
      id: urlId,
      user_id: userId,
    },
  })

  if (!url) {
    return reply.status(404).send({ error: 'URL não encontrada' })
  }

  await prisma.shortenedUrl.delete({
    where: {
      id: urlId,
      user_id: userId,
    },
  })
  reply.send({ message: 'URL deletada com sucesso' })
}

export async function getClickHistory(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const shortCodeSchema = z.object({
    shortCode: z.string(),
  })
  const { shortCode } = shortCodeSchema.parse(request.params)

  if (!shortCode) {
    return reply.status(401).send({ error: 'shortCode não fornecido' })
  }

  const clickHistory = await prisma.shortenedUrl.findFirst({
    where: {
      short_url: shortCode,
    },
    select: {
      clicks: true,
      clickDates: true,
    },
  })

  if (!clickHistory) {
    return reply.status(404).send({ error: 'URL não encontrada' })
  }

  const clickDatesCount: Record<string, number> = {}

  clickHistory.clickDates.forEach((date) => {
    const dateString = date.toISOString().split('T')[0]
    clickDatesCount[dateString] = (clickDatesCount[dateString] || 0) + 1
  })

  reply.send({
    totalClicks: clickHistory.clicks,
    clickDates: clickDatesCount,
  })
}
