import { FastifyRequest, FastifyReply } from 'fastify'
import { z } from 'zod'
import bcrypt from 'bcryptjs'
import { nanoid } from 'nanoid'
import jwt from 'jsonwebtoken'
import { UserRepository } from '../../repositories/UserRepository'
import { User } from '../../models/User'

export async function registerUser(
  request: FastifyRequest,
  reply: FastifyReply,
  UserRepository: UserRepository,
) {
  const userSchema = z.object({
    name: z.string(),
    email: z.string().email(),
    password: z.string().min(8),
  })

  const { name, email, password } = userSchema.parse(request.body)

  if (!name || !email || !password) {
    return reply
      .status(400)
      .send({ error: 'Nome, email e senha são obrigatórios' })
  }

  const existingUser = await UserRepository.findByEmail(email)

  if (existingUser) {
    return reply.status(409).send({
      error: 'Email já cadastrado',
    })
  }

  const newUser: User = {
    id: nanoid(),
    name,
    email,
    password: bcrypt.hashSync(password, 8),
    created_at: new Date(),
  }

  await UserRepository.createUser(newUser)

  return reply.status(201).send({ message: 'Usuário criado com sucesso' })
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
