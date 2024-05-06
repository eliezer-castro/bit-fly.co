import { FastifyRequest, FastifyReply } from 'fastify'
import { z } from 'zod'
import { prisma } from '../../lib/prisma'
import bcrypt from 'bcryptjs'
import { nanoid } from 'nanoid'
import jwt from 'jsonwebtoken'

export async function registerUser(
  request: FastifyRequest,
  reply: FastifyReply,
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

  const existingUser = await prisma.user.findFirst({
    where: {
      email,
    },
  })

  if (existingUser) {
    return reply.status(409).send({
      error: 'Email já cadastrado',
    })
  }

  await prisma.user.create({
    data: {
      id: nanoid(),
      name,
      email,
      password: bcrypt.hashSync(password, 8),
    },
  })

  return reply.status(201).send({ message: 'Usuário criado com sucesso' })
}

export async function loginUser(request: FastifyRequest, reply: FastifyReply) {
  const loginSchema = z.object({
    email: z.string().email(),
    password: z.string().min(8),
  })

  const { email, password } = loginSchema.parse(request.body)

  if (!email || !password) {
    return reply.status(400).send({ error: 'Email e senha são obrigatórios' })
  }

  const user = await prisma.user.findFirst({
    where: {
      email,
    },
  })
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
    expiresIn: 600,
  })

  return reply.send({ token })
}
