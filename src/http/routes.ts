import { FastifyInstance } from 'fastify'
import {
  createShortUrl,
  deleteShortUrl,
  getAllShortUrls,
  getShortUrlDetails,
  redirectToOriginalUrl,
} from './controllers/urlController'
import { loginUser, registerUser } from './controllers/authController'
import { authenticate } from './middleware/authMiddleware'

export async function appRoutes(app: FastifyInstance) {
  app.post(
    '/api/v1/shorten-url',
    {
      preHandler: authenticate,
      schema: {
        tags: ['Shorten URL'],
        body: {
          type: 'object',
          properties: {
            url: { type: 'string', format: 'uri' },
            customAlias: { type: 'string' },
          },
          required: ['url'],
        },
        security: [{ BearerAuth: [] }],
        response: {
          201: {
            type: 'object',
            properties: {
              shortUrl: { type: 'string', format: 'uri' },
            },
          },
        },
      },
    },
    createShortUrl,
  )

  app.get(
    '/api/v1/:shortCode',
    {
      schema: {
        tags: ['Shorten URL'],
        params: {
          type: 'object',
          properties: {
            shortCode: { type: 'string' },
          },
          required: ['shortCode'],
        },
        response: {
          302: {
            type: 'object',
            properties: {
              message: { type: 'string' },
            },
          },
        },
      },
    },
    redirectToOriginalUrl,
  )

  app.get(
    '/api/v1/user/urls',
    {
      preHandler: authenticate,

      schema: {
        tags: ['Shorten URL'],
        security: [{ BearerAuth: [] }],
        response: {
          200: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                id: { type: 'string' },
                long_url: { type: 'string' },
                short_url: { type: 'string' },
                clicks: { type: 'integer' },
                created_at: { type: 'string', format: 'date-time' },
                user_id: { type: 'string' },
              },
            },
          },
        },
      },
    },
    getAllShortUrls,
  )

  app.get(
    '/api/v1/url-details',
    {
      preHandler: authenticate,

      schema: {
        tags: ['Shorten URL'],
        querystring: {
          type: 'object',
          properties: {
            urlId: { type: 'string' },
          },
          required: ['urlId'],
        },
        security: [{ BearerAuth: [] }],
        response: {
          200: {
            type: 'object',
            properties: {
              id: { type: 'string' },
              long_url: { type: 'string', format: 'uri' },
              short_url: { type: 'string', format: 'uri' },
              clicks: { type: 'integer' },
              created_at: { type: 'string', format: 'date-time' },
            },
          },
        },
      },
    },
    getShortUrlDetails,
  )

  app.delete(
    '/api/v1/delete-url',
    {
      preHandler: authenticate,

      schema: {
        tags: ['Shorten URL'],
        querystring: {
          type: 'object',
          properties: {
            urlId: { type: 'string' },
          },
          required: ['urlId'],
        },
        security: [{ BearerAuth: [] }],
        response: {
          200: {
            type: 'object',
            properties: {
              message: { type: 'string' },
            },
          },
        },
      },
    },
    deleteShortUrl,
  )

  app.post(
    '/api/v1/register',
    {
      schema: {
        tags: ['Authentication'],
        body: {
          type: 'object',
          properties: {
            name: { type: 'string' },
            email: { type: 'string', format: 'email' },
            password: { type: 'string' },
          },
          required: ['name', 'email', 'password'],
        },
        response: {
          201: {
            type: 'object',
            properties: {
              message: { type: 'string' },
            },
          },
        },
      },
    },
    registerUser,
  )

  app.post(
    '/api/v1/login',
    {
      schema: {
        tags: ['Authentication'],
        body: {
          type: 'object',
          properties: {
            email: { type: 'string', format: 'email' },
            password: { type: 'string' },
          },
          required: ['email', 'password'],
        },
        response: {
          200: {
            type: 'object',
            properties: {
              token: { type: 'string' },
            },
          },
        },
      },
    },
    loginUser,
  )
}
