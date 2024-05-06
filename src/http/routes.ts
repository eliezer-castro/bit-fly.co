import { FastifyInstance } from 'fastify'
import {
  createShortUrl,
  deleteShortUrl,
  getAllShortUrls,
  getShortUrlDetails,
  redirectToOriginalUrl,
} from './controllers/shortUrlController'
import { loginUser, registerUser } from './controllers/authController'
import { authenticate } from './middleware/authMiddleware'

export async function appRoutes(app: FastifyInstance) {
  app.post('/api/v1/shorten-url', { preHandler: authenticate }, createShortUrl)
  app.get(
    '/api/v1/:shortCode',
    { preHandler: authenticate },
    redirectToOriginalUrl,
  )
  app.get(
    '/api/v1/user/:userId/urls',
    { preHandler: authenticate },
    getAllShortUrls,
  )
  app.get(
    '/api/v1/url-details',
    { preHandler: authenticate },
    getShortUrlDetails,
  )
  app.delete(
    '/apii/v1/delete-url',
    { preHandler: authenticate },
    deleteShortUrl,
  )
  app.post('/api/v1/register', registerUser)
  app.post('/api/v1/login', loginUser)
}
