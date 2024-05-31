import { FastifyInstance } from 'fastify'
import * as fs from 'fs'

import { registerUser } from './controllers/register-controller'
import { authController } from './controllers/auth-controller'
import { createUrl } from './controllers/create-url-controller'
import { updateUrl } from './controllers/update-url-controller'
import { redirect } from './controllers/redirect-controller'
import { getAllUrls } from './controllers/get-all-url-controller'
import { getUrl } from './controllers/get-url-controller'
import { deleteUrl } from './controllers/delete-url-controller'
import { clickAnalytics } from './controllers/click-analytics-controller'
import { verifyJTW } from './middleware/verify-jwt'
import { refreshTokenController } from './controllers/refresh-token-controller'
import { updateProfile } from './controllers/update-profile-controller'
import { getUserProfile } from './controllers/get-user-profile-controller'
import { deleteUser } from './controllers/delete-user-controller'
import { logoutController } from './controllers/logout-controller-controller'

export async function appRoutes(app: FastifyInstance) {
  const bufferIndexHtml = fs.readFileSync('public/index.html')

  app.get('/', async (request, reply) => {
    reply.type('text/html').send(bufferIndexHtml)
  })

  app.post(
    '/v1/urls',
    {
      onRequest: [verifyJTW],
      schema: {
        tags: ['URLs'],
        body: {
          type: 'object',
          properties: {
            longUrl: { type: 'string' },
            title: { type: 'string' },
            alias: { type: 'string' },
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
    createUrl,
  )

  app.put(
    '/v1/urls/:id',
    {
      onRequest: [verifyJTW],
      schema: {
        tags: ['URLs'],
        params: {
          type: 'object',
          properties: {
            id: { type: 'string' },
          },
          required: ['id'],
        },
        body: {
          type: 'object',
          properties: {
            title: { type: 'string' },
            short_url: { type: 'string' },
          },
        },
      },
    },
    updateUrl,
  )

  app.get(
    '/:shortCode',
    {
      schema: {
        tags: ['URLs'],
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
    redirect,
  )

  app.get(
    '/v1/urls',
    {
      onRequest: [verifyJTW],
      schema: {
        tags: ['URLs'],
        security: [{ BearerAuth: [] }],
        querystring: {
          type: 'object',
          properties: {
            limit: { type: 'integer' },
            orderBy: {
              type: 'string',
              enum: ['clicks', 'created_at', 'updated_at'],
            },
            orderDir: { type: 'string', enum: ['asc', 'desc'] },
            dateFrom: { type: 'string', format: 'date-time' },
            dateTo: { type: 'string', format: 'date-time' },
          },
        },
        response: {
          200: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                id: { type: 'string' },
                title: { type: 'string' },
                long_url: { type: 'string', format: 'uri' },
                short_url: { type: 'string', format: 'uri' },
                clicks: { type: 'integer' },
                clickDates: { type: 'array' },
                created_at: { type: 'string', format: 'date-time' },
                updated_at: { type: 'string', format: 'date-time' },
              },
            },
          },
        },
      },
    },
    getAllUrls,
  )

  app.get(
    '/v1/urls/:shortCode/details',
    {
      onRequest: [verifyJTW],
      schema: {
        tags: ['URLs'],
        params: {
          type: 'object',
          properties: {
            shortCode: { type: 'string' },
          },
          required: ['shortCode'],
        },
        security: [{ BearerAuth: [] }],
        response: {
          200: {
            type: 'object',
            properties: {
              id: { type: 'string' },
              title: { type: 'string' },
              long_url: { type: 'string', format: 'uri' },
              short_url: { type: 'string', format: 'uri' },
              clicks: { type: 'integer' },
              clickDates: { type: 'array' },
              created_at: { type: 'string', format: 'date-time' },
              updated_at: { type: 'string', format: 'date-time' },
            },
          },
        },
      },
    },
    getUrl,
  )

  app.delete(
    '/v1/urls/:id',
    {
      onRequest: [verifyJTW],
      schema: {
        tags: ['URLs'],
        params: {
          type: 'object',
          properties: {
            id: { type: 'string' },
          },
          required: ['id'],
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
    deleteUrl,
  )

  app.get(
    '/v1/urls/:id/analytics',
    {
      onRequest: [verifyJTW],
      schema: {
        tags: ['URLs'],
        security: [{ BearerAuth: [] }],
        params: {
          type: 'object',
          properties: {
            id: { type: 'string' },
          },
          required: ['id'],
        },
        response: {
          200: {
            type: 'object',
            properties: {
              totalClicks: {
                type: 'integer',
                description: 'Número total de cliques',
              },
              clickDates: {
                type: 'object',
                description: 'Número de cliques por data',
                additionalProperties: {
                  type: 'integer',
                  description: 'Número de cliques em uma determinada data',
                },
              },
            },
          },
        },
      },
    },
    clickAnalytics,
  )

  app.post(
    '/v1/register',
    {
      schema: {
        tags: ['Authentication'],
        body: {
          type: 'object',
          properties: {
            name: { type: 'string' },
            email: { type: 'string' },
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
    '/v1/login',
    {
      schema: {
        tags: ['Authentication'],
        body: {
          type: 'object',
          properties: {
            email: { type: 'string' },
            password: { type: 'string' },
          },
          required: ['email', 'password'],
        },
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
    authController,
  )

  app.post(
    '/v1/logout',
    {
      onRequest: [verifyJTW],
      schema: {
        tags: ['Authentication'],
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
    logoutController,
  )

  app.patch(
    '/v1/token/refresh',
    {
      schema: {
        tags: ['Authentication'],
      },
    },
    refreshTokenController,
  )

  app.put(
    '/v1/user/profile',
    {
      onRequest: [verifyJTW],
      schema: {
        tags: ['Users'],
        security: [{ BearerAuth: [] }],
        body: {
          type: 'object',
          properties: {
            name: { type: 'string' },
            email: { type: 'string' },
            currentPassword: { type: 'string' },
            password: { type: 'string' },
          },
        },
        response: {
          200: {
            type: 'object',
            properties: {
              message: { type: 'string' },
              data: {
                type: 'object',
                properties: {
                  id: { type: 'string' },
                  name: { type: 'string' },
                  email: { type: 'string' },
                  password: { type: 'string' },
                },
              },
            },
          },
        },
      },
    },
    updateProfile,
  )

  app.get(
    '/v1/user/profile',
    {
      onRequest: [verifyJTW],
      schema: {
        tags: ['Users'],
        security: [{ BearerAuth: [] }],
        response: {
          200: {
            type: 'object',
            properties: {
              id: { type: 'string' },
              name: { type: 'string' },
              email: { type: 'string' },
              password: { type: 'string' },
              created_at: { type: 'string', format: 'date-time' },
            },
          },
        },
      },
    },
    getUserProfile,
  )

  app.delete(
    '/v1/user',
    {
      onRequest: [verifyJTW],
      schema: {
        tags: ['Users'],
        security: [{ BearerAuth: [] }],
        body: {
          type: 'object',
          properties: {
            password: { type: 'string' },
          },
          required: ['password'],
        },
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
    deleteUser,
  )
}
