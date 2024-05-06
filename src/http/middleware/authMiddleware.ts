import jwt from 'jsonwebtoken'
import { FastifyRequest, FastifyReply } from 'fastify'

export async function authenticate(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const token = request.headers.authorization?.replace('Bearer ', '')

  if (!token) {
    return reply.status(401).send({ error: 'Token não fornecido' })
  }

  try {
    if (!process.env.JWT_SECRET) {
      throw new Error('JWT_SECRET não está definido')
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    const userId = typeof decoded === 'string' ? decoded : decoded.userId

    if (!userId) {
      return reply.status(401).send({ error: 'Token inválido' })
    }

    request.headers.user = userId
  } catch (error) {
    return reply.status(401).send({ error: 'Token inválido' })
  }
}
