import { FastifyRequest, FastifyReply } from 'fastify'
import { z } from 'zod'
import { prisma } from '../../lib/prisma'
import { nanoid } from 'nanoid'

export async function createShortUrl(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const urlSchema = z.object({
    url: z.string().url(),
    customAlias: z.string().optional(),
    userId: z.string(),
  })

  const { url, customAlias, userId } = urlSchema.parse(request.body)

  if (!url || !userId) {
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

  const shortUrl = customAlias || Math.random().toString(36).substring(2, 7)

  await prisma.shortenedUrl.create({
    data: {
      id: nanoid(),
      long_url: url,
      short_url: shortUrl,
      user_id: userId,
    },
  })

  reply.status(201).send({
    shortUrl: `${request.protocol}://${request.headers.host}/${shortUrl}`,
  })
}

export async function redirectToOriginalUrl(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const redirectSchema = z.object({
    redirectUrl: z.string(),
  })

  const { redirectUrl } = redirectSchema.parse(request.params)

  console.log(redirectUrl)

  if (!redirectUrl) {
    return reply.status(400).send({ error: 'URL inválida' })
  }

  const url = await prisma.shortenedUrl.findFirst({
    where: {
      short_url: redirectUrl,
    },
  })
  console.log(url)

  if (!url) {
    return reply.status(404).send({ error: 'URL não encontrada' })
  }

  await prisma.shortenedUrl.update({
    where: {
      short_url: redirectUrl,
    },
    data: {
      clicks: {
        increment: 1,
      },
    },
  })

  reply.redirect(url.long_url)
}

export async function getAllShortUrls(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const userSchema = z.object({
    userId: z.string(),
  })

  const { userId } = userSchema.parse(request.params)
  console.log(userId)

  if (!userId) {
    return reply.status(400).send({ error: 'userId é obrigatório' })
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
    urlId: z.string(),
    userId: z.string(),
  })

  const { urlId, userId } = getUrlSchema.parse(request.query)

  if (!urlId || !userId) {
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
      id: urlId,
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
    userId: z.string(),
  })

  const { urlId, userId } = deleteUrlSchema.parse(request.query)

  if (!urlId || !userId) {
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
