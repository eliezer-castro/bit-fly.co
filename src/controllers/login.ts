import { UserRepositoryImpl } from '@/repositories/user-repository-impl'
import { InvalidCredentials } from '@/use-cases/errors/invalid-credentials-erros'
import { LoginUseCase } from '@/use-cases/login'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

export async function authenticate(
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
    const loginUseCase = new LoginUseCase(userRepository)
    const session = await loginUseCase.execute({ email, password })

    const token = await reply.jwtSign(
      {},
      {
        sign: {
          sub: session.user.id,
        },
      },
    )
    const refreshToken = await reply.jwtSign(
      {},
      {
        sign: {
          sub: session.user.id,
          expiresIn: '7d',
        },
      },
    )

    return reply
      .setCookie('refreshToken', refreshToken, {
        path: '/',
        secure: true,
        sameSite: true,
        httpOnly: true,
      })
      .status(200)
      .send({ token })
  } catch (error) {
    if (error instanceof InvalidCredentials) {
      return reply.status(400).send({ message: error.message })
    }
    throw error
  }
}
