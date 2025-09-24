import fastify from 'fastify'

const jwt = fastify().jwt

export const jwtUtils = {
  generateTokens: (userId: number) => {
    const accessToken = jwt.sign({ userId }, { expiresIn: '15m' })
    const refreshToken = jwt.sign({ userId }, { expiresIn: '7d' })
    return { accessToken, refreshToken }
  },
}
