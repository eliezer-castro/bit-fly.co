import { FastifyInstance } from 'fastify'
import {
  createUrl,
  redirectUrl,
  getAllUrls,
  getUrl,
  deleteUrl,
} from './controllers/shortUrlController'
import { createUser, login } from './controllers/authController'
import { authenticate } from './middleware/authMiddleware'

export async function appRoutes(app: FastifyInstance) {
  app.post(
    '/create-url',
    {
      preHandler: authenticate,
    },
    createUrl,
  )
  app.get('/:redirectUrl', redirectUrl)
  app.get(
    '/get-all-urls/:userId',
    {
      preHandler: authenticate,
    },
    getAllUrls,
  )
  app.get(
    '/get-url',
    {
      preHandler: authenticate,
    },
    getUrl,
  )
  app.delete(
    '/delete-url',
    {
      preHandler: authenticate,
    },
    deleteUrl,
  )
  app.post('/register', createUser)
  app.post('/login', login)
}
