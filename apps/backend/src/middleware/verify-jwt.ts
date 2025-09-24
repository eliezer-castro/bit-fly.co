import { Unauthorized } from '@/use-cases/errors/unauthorized-error'
import { FastifyRequest, FastifyReply } from 'fastify'

export async function verifyJTW(request: FastifyRequest, reply: FastifyReply) {
  try {
    if (!request.headers.authorization) {
      throw new Error()
    }
    await request.jwtVerify()
  } catch (error) {
    return reply.status(401).send(Unauthorized)
  }
}
