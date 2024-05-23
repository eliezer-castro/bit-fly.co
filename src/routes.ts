import { FastifyInstance } from 'fastify'
import { generateSuggestion } from './controllers/generate-suggestion'
import { registerUser } from './controllers/register'
import { authenticate } from './controllers/login'
import { createUrl } from './controllers/create-url'
import { updateUrl } from './controllers/update-url'
import { redirect } from './controllers/redirect'
import { getAllUrls } from './controllers/get-all-url'
import { getUrl } from './controllers/get-url'
import { deleteUrl } from './controllers/delete-url'
import { clickAnalytics } from './controllers/click-analytics'
import { verifyJTW } from './middleware/verify-jwt'
import { refresh } from './controllers/refresh'

export async function appRoutes(app: FastifyInstance) {
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

  app.post(
    '/v1/urls/suggestions',
    {
      onRequest: [verifyJTW],
      schema: {
        tags: ['URLs'],
      },
    },
    generateSuggestion,
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
              token: { type: 'string' },
            },
          },
        },
      },
    },
    authenticate,
  )

  app.patch(
    '/v1/token/refresh',
    {
      schema: {
        tags: ['Authentication'],
      },
    },
    refresh,
  )
}
