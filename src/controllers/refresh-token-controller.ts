import { TokenRepositoryImpl } from '@/repositories/token-repository-imp'
import { InvalidRefreshToken } from '@/use-cases/errors/invalid-refresh-token'
import { RefreshTokenUseCase } from '@/use-cases/refresh-token-use-case'
import { FastifyReply, FastifyRequest } from 'fastify'

export async function refreshTokenController(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const tokenRepository = new TokenRepositoryImpl()
  const refreshTokenUseCase = new RefreshTokenUseCase(tokenRepository)

  await request.jwtVerify({ onlyCookie: true })

  try {
    const oldRefreshToken = request.cookies.refreshToken

    if (!oldRefreshToken) {
      return reply.status(401).send({ message: 'Unauthorized' })
    }

    const decoded = await request.jwtVerify<{ userId: string }>({
      onlyCookie: true,
    })
    const userId = decoded.userId

    const newAccessToken = await reply.jwtSign(
      { userId },
      {
        sign: {
          sub: userId,
          expiresIn: '10m',
        },
      },
    )
    const newRefreshToken = await reply.jwtSign(
      { userId },
      {
        sign: {
          sub: userId,
          expiresIn: '7d',
        },
      },
    )

    await refreshTokenUseCase.execute({
      oldToken: oldRefreshToken,
      refreshToken: newRefreshToken,
    })

    return reply
      .setCookie('refreshToken', newRefreshToken, {
        path: '/',
        secure: true,
        sameSite: true,
        httpOnly: true,
      })
      .status(200)
      .send({ accessToken: newAccessToken })
  } catch (error) {
    if (error instanceof InvalidRefreshToken) {
      return reply.status(404).send({ message: error.message })
    }

    return reply.status(401).send({ message: 'Unauthorized' })
  }
}
