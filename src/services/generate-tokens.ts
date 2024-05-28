import { FastifyReply } from 'fastify'

export async function generateTokens(userId: string, reply: FastifyReply) {
  const accessToken = await reply.jwtSign(
    { userId },
    {
      sign: {
        sub: userId,
        expiresIn: '10m',
      },
    },
  )

  const refreshToken = await reply.jwtSign(
    { userId },
    {
      sign: {
        sub: userId,
        expiresIn: '7d',
      },
    },
  )

  return { accessToken, refreshToken }
}
