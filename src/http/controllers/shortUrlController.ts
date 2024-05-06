import { FastifyRequest, FastifyReply } from 'fastify'
import { z } from 'zod'
import { prisma } from '../../lib/prisma'
import { nanoid } from 'nanoid'
import jwt from 'jsonwebtoken'

export async function createShortUrl(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const urlSchema = z.object({
    url: z.string().url(),
    customAlias: z.string().optional(),
  })

  const { url, customAlias } = urlSchema.parse(request.body)

  const token = request.headers.authorization?.replace('Bearer ', '')

  if (!token) {
    return reply.status(401).send({ error: 'Token não fornecido' })
  }

  if (!process.env.JWT_SECRET) {
    throw new Error('JWT_SECRET não está definido')
  }
  const decoded = jwt.verify(token, process.env.JWT_SECRET)
  const userId = typeof decoded === 'string' ? decoded : decoded.userId

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
    shortCode: z.string(),
  })

  const { shortCode } = redirectSchema.parse(request.params)

  console.log(shortCode)

  if (!shortCode) {
    return reply.status(400).send({ error: 'URL inválida' })
  }

  const url = await prisma.shortenedUrl.findFirst({
    where: {
      short_url: shortCode,
    },
  })
  console.log(url)

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
    },
  })

  reply.redirect(url.long_url)
}

export async function getAllShortUrls(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const token = request.headers.authorization?.replace('Bearer ', '')

  if (!token) {
    return reply.status(401).send({ error: 'Token não fornecido' })
  }

  if (!process.env.JWT_SECRET) {
    throw new Error('JWT_SECRET não está definido')
  }
  const decoded = jwt.verify(token, process.env.JWT_SECRET)
  const userId = typeof decoded === 'string' ? decoded : decoded.userId

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
  })

  const { urlId } = getUrlSchema.parse(request.query)

  const token = request.headers.authorization?.replace('Bearer ', '')

  if (!token) {
    return reply.status(401).send({ error: 'Token não fornecido' })
  }

  if (!process.env.JWT_SECRET) {
    throw new Error('JWT_SECRET não está definido')
  }
  const decoded = jwt.verify(token, process.env.JWT_SECRET)
  const userId = typeof decoded === 'string' ? decoded : decoded.userId

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
  })

  const { urlId } = deleteUrlSchema.parse(request.query)
  const token = request.headers.authorization?.replace('Bearer ', '')

  if (!token) {
    return reply.status(401).send({ error: 'Token não fornecido' })
  }

  if (!process.env.JWT_SECRET) {
    throw new Error('JWT_SECRET não está definido')
  }
  const decoded = jwt.verify(token, process.env.JWT_SECRET)
  const userId = typeof decoded === 'string' ? decoded : decoded.userId

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
