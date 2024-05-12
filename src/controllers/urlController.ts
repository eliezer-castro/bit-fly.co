import { FastifyRequest, FastifyReply } from 'fastify'
import { z } from 'zod'
import { verifyUserToken } from '../services/authUtils'
import { UserRepositoryImpl } from '@/repositories/user-repository-impl'
import { ShortenedUrlRepositoryImpl } from '@/repositories/shortened-url-repository-impl'
import { CreateShortUrlUseCase } from '@/use-cases/create-short-url'
import { AliasAlreadyExists } from '@/use-cases/errors/alias-already-exists'
import { UpdateShortUrlCaseUse } from '@/use-cases/update-short-Url'
import { UrlNotExists } from '@/use-cases/errors/url-not-exists'
import { MissingFields } from '@/use-cases/errors/missing-fields'
import { UrlAlreadtExists } from '@/use-cases/errors/url-already-exists'
import { RedirectCaseUse } from '@/use-cases/redirect'
import { InvalidUrl } from '@/use-cases/errors/invalid-url'
import { GetAllUrlsUseCase } from '@/use-cases/get-all-urls'
import { GetUrlUseCase } from '@/use-cases/get-url'
import { DeleteUrlUseCase } from '@/use-cases/delete-url'
import { UserNotExists } from '@/use-cases/errors/user-not-exists'
import { ClickAnalyticsUseCase } from '@/use-cases/click-analytics'
import { Unauthorized } from '@/use-cases/errors/unauthorized'
import { GenerateSuggestion } from '@/use-cases/generate-suggestion'

export async function createShortUrl(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const urlSchema = z.object({
    url: z.string().url(),
    title: z.string().optional(),
    alias: z.string().optional(),
  })

  try {
    const { url, title, alias } = urlSchema.parse(request.body)

    const token = request.headers.authorization?.replace('Bearer ', '') || ''

    const jwtSecret = process.env.JWT_SECRET || ''

    const user = await verifyUserToken({ token, jwtSecret })

    const userRepository = new UserRepositoryImpl()
    const shortenedUrlRepository = new ShortenedUrlRepositoryImpl()
    const registerUseCase = new CreateShortUrlUseCase(
      userRepository,
      shortenedUrlRepository,
    )

    const data = await registerUseCase.execute({
      url,
      title,
      alias,
      userId: user.userId,
    })

    console.log(data)
    reply.status(201).send({
      shortUrl: `${request.protocol}://${request.headers.host}/${data.short_url}`,
    })
  } catch (error) {
    if (error instanceof AliasAlreadyExists) {
      return reply.status(409).send({ message: error.message })
    }
    throw error
  }
}

export async function updateShortUrl(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const updateUrlSchema = z.object({
    UrlId: z.string(),
    newShortUrl: z.string().optional(),
    newTitleUrl: z.string().optional(),
  })

  const { UrlId, newShortUrl, newTitleUrl } = updateUrlSchema.parse(
    request.body,
  )

  const token = request.headers.authorization?.replace('Bearer ', '') || ''

  const jwtSecret = process.env.JWT_SECRET || ''

  const user = await verifyUserToken({ token, jwtSecret })

  try {
    const userRepository = new UserRepositoryImpl()
    const shortenedUrlRepository = new ShortenedUrlRepositoryImpl()
    const registerUseCase = new UpdateShortUrlCaseUse(
      userRepository,
      shortenedUrlRepository,
    )

    await registerUseCase.execute({
      urlId: UrlId,
      userId: user.userId,
      newShortUrl,
      newTitleUrl,
    })

    reply.send({ message: 'URL atualizada com sucesso' })
  } catch (error) {
    if (error instanceof MissingFields) {
      return reply.status(400).send({ message: error.message })
    }

    if (error instanceof UrlNotExists) {
      return reply.status(404).send({ message: error.message })
    }

    if (error instanceof UrlAlreadtExists) {
      return reply.status(409).send({ message: error.message })
    }
    throw error
  }
}

export async function redirectToOriginalUrl(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const redirectSchema = z.object({
    shortCode: z.string(),
  })

  const { shortCode } = redirectSchema.parse(request.params)

  try {
    const shortenedUrlRepository = new ShortenedUrlRepositoryImpl()
    const redirectCaseUse = new RedirectCaseUse(shortenedUrlRepository)

    const originalUrl = await redirectCaseUse.execute(shortCode)

    reply.redirect(originalUrl)
  } catch (error) {
    if (error instanceof InvalidUrl) {
      return reply.status(400).send({ message: error.message })
    }

    if (error instanceof UrlNotExists) {
      return reply.status(404).send({ message: error.message })
    }
    throw error
  }
}

export async function getAllUrls(request: FastifyRequest, reply: FastifyReply) {
  const filter = z.object({
    limit: z.number().optional(),
    orderBy: z.enum(['clicks', 'created_at', 'updated_at']).optional(),
    orderDir: z.enum(['asc', 'desc']).optional(),
    dateFrom: z.string().optional(),
    dateTo: z.string().optional(),
  })

  const { limit, orderBy, orderDir, dateFrom, dateTo } = filter.parse(
    request.query,
  )

  const token = request.headers.authorization?.replace('Bearer ', '') || ''

  const jwtSecret = process.env.JWT_SECRET || ''

  const user = await verifyUserToken({ token, jwtSecret })

  const shortenedUrlRepository = new ShortenedUrlRepositoryImpl()

  const getAllUrlsUseCase = new GetAllUrlsUseCase(shortenedUrlRepository)

  const urls = await getAllUrlsUseCase.execute(user.userId, {
    limit,
    orderBy,
    orderDir,
    dateFrom,
    dateTo,
  })

  reply.send(urls)
}

export async function getUrl(request: FastifyRequest, reply: FastifyReply) {
  const getUrlSchema = z.object({
    shortCode: z.string(),
  })

  const { shortCode } = getUrlSchema.parse(request.params)

  const token = request.headers.authorization?.replace('Bearer ', '') || ''

  const jwtSecret = process.env.JWT_SECRET || ''

  const user = await verifyUserToken({ token, jwtSecret })

  try {
    const shortenedUrlRepository = new ShortenedUrlRepositoryImpl()

    const getUrlUseCase = new GetUrlUseCase(shortenedUrlRepository)

    const url = await getUrlUseCase.execute(user.userId, shortCode)

    reply.send(url)
  } catch (error) {
    if (error instanceof UrlNotExists) {
      return reply.status(404).send({ message: error.message })
    }
    throw error
  }
}

export async function deleteShortUrl(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const deleteUrlSchema = z.object({
    shortUrl: z.string(),
  })

  const { shortUrl } = deleteUrlSchema.parse(request.query)

  const token = request.headers.authorization?.replace('Bearer ', '') || ''

  const jwtSecret = process.env.JWT_SECRET || ''

  const user = await verifyUserToken({ token, jwtSecret })

  try {
    const shortenedUrlRepository = new ShortenedUrlRepositoryImpl()
    const userRepository = new UserRepositoryImpl()
    const deleteUrlUseCase = new DeleteUrlUseCase(
      shortenedUrlRepository,
      userRepository,
    )

    await deleteUrlUseCase.execute(user.userId, shortUrl)

    reply.send({ message: 'URL deletada com sucesso' })
  } catch (error) {
    if (error instanceof UrlNotExists) {
      return reply.status(404).send({ message: error.message })
    }
    if (error instanceof UserNotExists) {
      return reply.status(404).send({ message: error.message })
    }
    throw error
  }
}

export async function clickAnalytics(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const shortCodeSchema = z.object({
    shortCode: z.string(),
  })
  const { shortCode } = shortCodeSchema.parse(request.params)

  try {
    const token = request.headers.authorization?.replace('Bearer ', '') || ''

    const jwtSecret = process.env.JWT_SECRET || ''

    const user = await verifyUserToken({ token, jwtSecret })

    const shortenedUrlRepository = new ShortenedUrlRepositoryImpl()
    const clickAnalyticsUseCase = new ClickAnalyticsUseCase(
      shortenedUrlRepository,
    )

    const analytics = await clickAnalyticsUseCase.execute(
      user.userId,
      shortCode,
    )

    reply.send(analytics)
  } catch (error) {
    if (error instanceof UrlNotExists) {
      return reply.status(404).send({ message: error.message })
    }

    if (error instanceof Unauthorized) {
      return reply.status(401).send({ message: error.message })
    }
    throw error
  }
}

export async function generateSuggestion(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const generateFriendlyLinkSchema = z.object({
    url: z.string().url(),
    title: z.string().optional(),
    keywords: z.array(z.string()).optional(),
  })

  const { url, title, keywords } = generateFriendlyLinkSchema.parse(
    request.body,
  )

  const token = request.headers.authorization?.replace('Bearer ', '') || ''

  const jwtSecret = process.env.JWT_SECRET || ''

  const user = await verifyUserToken({ token, jwtSecret })

  try {
    const shortenedUrlRepository = new ShortenedUrlRepositoryImpl()
    const userRepository = new UserRepositoryImpl()
    const generateSuggestion = new GenerateSuggestion(
      shortenedUrlRepository,
      userRepository,
    )

    const suggestion = await generateSuggestion.execute(
      user.userId,
      title || '',
      url,
      keywords || [],
    )

    reply.status(201).send({
      suggestion: `${request.protocol}://${request.headers.host}/${suggestion}`,
    })
  } catch (error) {
    return reply.status(500).send(error)
  }
}
