import { FastifyReply, FastifyRequest } from 'fastify'
import { GetUserProfileUseCase } from '@/use-cases/get-user-profile-use-case'
import { UserNotExists } from '@/use-cases/errors/user-not-exists-error'
import { UserRepositoryImpl } from '@/repositories/user-repository-impl'

export async function getUserProfile(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  try {
    const userRepository = new UserRepositoryImpl()

    const getUserProfileUseCase = new GetUserProfileUseCase(userRepository)

    const userProfile = await getUserProfileUseCase.execute(request.user.sub)

    reply.send(userProfile)
  } catch (error) {
    if (error instanceof UserNotExists) {
      return reply.status(404).send({ message: error.message })
    }
    throw error
  }
}
