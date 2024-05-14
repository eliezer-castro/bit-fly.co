import { Unauthorized } from '@/use-cases/errors/unauthorized'
import { FastifyRequest, FastifyReply } from 'fastify'

export async function verifyJTW(request: FastifyRequest, reply: FastifyReply) {
  try {
    await request.jwtVerify()
  } catch (error) {
    return reply.status(401).send(Unauthorized)
  }
}
