import { UserRepositoryImpl } from '@/repositories/user-repository-impl'
import { EmailAlreadyExists } from '@/use-cases/errors/email-already-exists'
import { InvalidPassword } from '@/use-cases/errors/invalid-password'
import { MissingFields } from '@/use-cases/errors/missing-fields'
import { UserNotExists } from '@/use-cases/errors/user-not-exists'
import { UpdateUserProfileUseCase } from '@/use-cases/update-profile'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

export async function updateProfile(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const updateBodySchema = z.object({
    name: z.string().optional(),
    email: z.string().optional(),
    currentPassword: z.string().optional(),
    password: z.string().optional(),
  })

  const { name, email, currentPassword, password } = updateBodySchema.parse(
    request.body,
  )

  try {
    const userRepository = new UserRepositoryImpl()
    const updateProfileUseCase = new UpdateUserProfileUseCase(userRepository)

    const user = await updateProfileUseCase.execute({
      userId: request.user.sub,
      name,
      email,
      currentPassword,
      password,
    })

    reply.send({ message: 'Perfil atualizado com sucesso', data: user })
  } catch (error) {
    if (error instanceof MissingFields) {
      return reply.status(400).send({ message: error.message })
    }

    if (error instanceof UserNotExists) {
      return reply.status(404).send({ message: error.message })
    }

    if (error instanceof EmailAlreadyExists) {
      return reply.status(409).send({ message: error.message })
    }

    if (error instanceof InvalidPassword) {
      return reply.status(400).send({ message: error.message })
    }
    throw error
  }
}
