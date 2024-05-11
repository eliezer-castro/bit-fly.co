import jwt from 'jsonwebtoken'

interface VerifyTokenInput {
  token: string
  jwtSecret: string
}

export async function verifyUserToken(input: VerifyTokenInput) {
  const { token, jwtSecret } = input

  try {
    if (!token) {
      throw new Error('Token não fornecido')
    }

    if (!jwtSecret) {
      throw new Error('JWT_SECRET não está definido')
    }

    const decoded = jwt.verify(token, jwtSecret)
    const userId: string =
      typeof decoded === 'string' ? decoded : decoded.userId

    if (!userId) {
      throw new Error('Token inválido')
    }

    return { userId }
  } catch (error) {
    throw new Error('Token inválido')
  }
}
