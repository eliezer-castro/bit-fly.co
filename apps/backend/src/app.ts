import fastify from 'fastify'
import fastifyCors from '@fastify/cors'
import { ZodError } from 'zod'
import { appRoutes } from './routes'
import fastifyJwt from '@fastify/jwt'
import { fastifyCookie } from '@fastify/cookie'
import { env } from './env'

export const app = fastify()

app.register(import('@fastify/swagger'), {
  swagger: {
    securityDefinitions: {
      BearerAuth: {
        type: 'apiKey',
        name: 'Authorization',
        in: 'header',
        description: 'JWT Authorization header using the Bearer scheme',
      },
    },
  },
})
app.register(import('@fastify/swagger-ui'), {
  routePrefix: '/docs',
})
app.register(fastifyCors)
app.register(fastifyCookie)

app.register(fastifyJwt, {
  secret: env.JWT_SECRET,
  cookie: {
    cookieName: 'refreshToken',
    signed: false,
  },
  sign: {
    expiresIn: '10m',
  },
})

app.register(appRoutes)

app.setErrorHandler(function (error, _, reply) {
  if (error instanceof ZodError) {
    const formatIssues = error.issues.map((issue) => ({
      path: issue.path,
      message: issue.message,
    }))

    return reply
      .status(400)
      .send({ message: 'Validation error.', issues: formatIssues })
  }

  return reply.status(500).send({ message: error })
})
