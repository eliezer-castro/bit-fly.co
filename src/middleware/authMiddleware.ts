import { verifyUserToken } from '@/services/authUtils'
import { FastifyRequest, FastifyReply } from 'fastify'

export async function authMiddleware(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  try {
    const token = request.headers.authorization?.replace('Bearer ', '') || ''

    const jwtSecret = process.env.JWT_SECRET || ''

    const user = await verifyUserToken({ token, jwtSecret })

    request.headers.user = user.userId
  } catch (error) {
    return reply.status(401).send({ error: 'Token inválido' })
  }
}
