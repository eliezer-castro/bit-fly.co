import fastify from 'fastify'
import fastifyCors from '@fastify/cors'
import { appRoutes } from './routes'

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

app.register(appRoutes)
