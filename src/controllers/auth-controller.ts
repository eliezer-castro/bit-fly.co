import { TokenRepositoryImpl } from '@/repositories/token-repository-imp'
import { UserRepositoryImpl } from '@/repositories/user-repository-impl'
import { InvalidCredentials } from '@/use-cases/errors/invalid-credentials-erros'
import { AuthUseCase } from '@/use-cases/auth-use-case'
import { CreateTokenUseCase } from '@/use-cases/create-token-use-case'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'
import { generateTokens } from '@/services/generate-tokens'

export async function authController(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const loginSchema = z.object({
    email: z.string().email(),
    password: z.string().min(6),
  })

  const { email, password } = loginSchema.parse(request.body)

  try {
    const userRepository = new UserRepositoryImpl()
    const tokenRepository = new TokenRepositoryImpl()
    const tokenUseCase = new CreateTokenUseCase(tokenRepository)
    const authUseCase = new AuthUseCase(userRepository)

    const { user } = await authUseCase.execute({ email, password })

    const { accessToken, refreshToken } = await generateTokens(user.id, reply)

    await tokenUseCase.execute({
      token: refreshToken,
      user_id: user.id,
      expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    })

    return reply
      .setCookie('refreshToken', refreshToken, {
        path: '/',
        secure: true,
        sameSite: true,
        httpOnly: true,
      })
      .status(200)
      .send({ message: accessToken })
  } catch (error) {
    if (error instanceof InvalidCredentials) {
      return reply.status(400).send({ message: error.message })
    }
    throw error
  }
}
