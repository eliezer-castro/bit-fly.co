import { FastifyReply, FastifyRequest } from 'fastify'
import { TokenRepositoryImpl } from '@/repositories/token-repository-imp'

export async function logoutController(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const tokenRepository = new TokenRepositoryImpl()

  try {
    await request.jwtVerify({ onlyCookie: true })
  } catch (error) {
    return reply.status(401).send({ message: 'Unauthorized' })
  }

  const { refreshToken } = request.cookies

  if (refreshToken) {
    await tokenRepository.delete(refreshToken)
  }

  try {
    // Delete all refresh tokens associated with the user ID
    await tokenRepository.delete(refreshToken!)

    // Optionally clear the refresh token cookie if desired
    if (refreshToken) {
      reply.clearCookie('refreshToken', {
        path: '/',
        secure: true,
        sameSite: true,
        httpOnly: true,
      })
    }

    return reply
      .clearCookie('refreshToken', {
        path: '/',
        secure: true,
        sameSite: true,
        httpOnly: true,
      })
      .status(200)
      .send({ message: 'Logged out successfully' })
  } catch (error) {
    console.error('Error during logout:', error)
    return reply.status(500).send({ message: 'Internal server error' })
  }
}
