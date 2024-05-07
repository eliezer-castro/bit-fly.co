import { FastifyReply, FastifyRequest } from 'fastify'
import jwt from 'jsonwebtoken'

export async function verifyToken(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const token = request.headers.authorization?.replace('Bearer ', '')

  if (!token) {
    return reply.status(401).send({ error: 'Token não fornecido' })
  }

  if (!process.env.JWT_SECRET) {
    throw new Error('JWT_SECRET não está definido')
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    const userId = typeof decoded === 'string' ? decoded : decoded.userId

    if (!userId) {
      return reply.status(401).send({ error: 'Token inválido' })
    }

    return userId
  } catch (error) {
    return reply.status(401).send({ error: 'Token inválido' })
  }
}
