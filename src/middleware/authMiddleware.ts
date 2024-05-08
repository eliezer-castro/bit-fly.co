import { FastifyRequest, FastifyReply } from 'fastify'
import { verifyToken } from '../services/authUtils'

export async function authenticate(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  try {
    const userId = await verifyToken(request, reply)

    if (!userId) {
      return reply.status(401).send({ error: 'Token não fornecido' })
    }

    request.headers.user = userId
  } catch (error) {
    return reply.status(401).send({ error: 'Token inválido' })
  }
}
