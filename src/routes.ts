import { FastifyInstance } from 'fastify'
import { generateSuggestion } from './controllers/generate-suggestion'
import { authMiddleware } from './middleware/authMiddleware'
import { registerUser } from './controllers/register'
import { authenticate } from './controllers/login'
import { createUrl } from './controllers/create-url'
import { updateUrl } from './controllers/update-url'
import { redirect } from './controllers/redirect'
import { getAllUrls } from './controllers/get-all-url'
import { getUrl } from './controllers/get-url'
import { deleteUrl } from './controllers/delete-url'
import { clickAnalytics } from './controllers/click-analytics'

export async function appRoutes(app: FastifyInstance) {
  app.post(
    '/api/v1/shorten-url',
    {
      preHandler: authMiddleware,
      schema: {
        tags: ['Shorten URL'],
        body: {
          type: 'object',
          properties: {
            url: { type: 'string' },
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

  app.put('/api/v1/update-url', { preHandler: authMiddleware }, updateUrl)

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
    redirect,
  )

  app.get(
    '/api/v1/user/urls',
    {
      preHandler: authMiddleware,

      schema: {
        tags: ['Shorten URL'],
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
    '/api/v1/details/:shortCode',
    {
      preHandler: authMiddleware,

      schema: {
        tags: ['Shorten URL'],
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
    '/api/v1/delete-url',
    {
      preHandler: authMiddleware,

      schema: {
        tags: ['Shorten URL'],
        querystring: {
          type: 'object',
          properties: {
            shortUrl: { type: 'string' },
          },
          required: ['shortUrl'],
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
    '/api/v1/register',
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
    '/api/v1/sessions',
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
              user: {
                type: 'object',
                properties: {
                  id: { type: 'string' },
                  name: { type: 'string' },
                  email: { type: 'string' },
                  password: { type: 'string' }, // Se necessário
                  created_at: { type: 'string', format: 'date-time' },
                },
                required: ['id', 'name', 'email', 'created_at'], // Adicione 'password' se necessário
              },
              token: { type: 'string' },
            },
          },
        },
      },
    },
    authenticate,
  )

  app.get(
    '/api/v1/shortCode/:shortCode/clickAnalytics',
    {
      preHandler: authenticate,
      schema: {
        tags: ['Shorten URL'],
        security: [{ BearerAuth: [] }],
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
    '/api/v1/generate-suggestion',
    { preHandler: authMiddleware },
    generateSuggestion,
  )
}
