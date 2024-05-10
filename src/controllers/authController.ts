import { FastifyRequest, FastifyReply } from 'fastify'
import { z } from 'zod'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { UserRepository } from '../repositories/UserRepository'
import { registerUseCase } from '../use-cases/register'
import { UserAlreadyExists } from '../use-cases/errors/user-already-exists'

export async function registerUser(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const userSchema = z.object({
    name: z.string(),
    email: z.string().email(),
    password: z.string().min(6),
  })

  const { name, email, password } = userSchema.parse(request.body)

  try {
    await registerUseCase({ name, email, password })
  } catch (error) {
    if (error instanceof UserAlreadyExists) {
      return reply.status(409).send(error.message)
    }

    throw error
  }
}

export async function loginUser(
  request: FastifyRequest,
  reply: FastifyReply,
  userRepository: UserRepository,
) {
  const loginSchema = z.object({
    email: z.string().email(),
    password: z.string().min(8),
  })

  const { email, password } = loginSchema.parse(request.body)

  if (!email || !password) {
    return reply.status(400).send({ error: 'Email e senha são obrigatórios' })
  }

  const user = await userRepository.findByEmail(email)

  if (!user) {
    return reply.status(404).send({ error: 'Usuário não encontrado' })
  }

  const passwordIsValid = bcrypt.compareSync(password, user.password)

  if (!passwordIsValid) {
    return reply.status(401).send({ error: 'Senha inválida' })
  }

  if (!process.env.JWT_SECRET) {
    throw new Error('JWT_SECRET não está definido')
  }

  const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, {
    expiresIn: '1h',
  })

  return reply.send({ token })
}
