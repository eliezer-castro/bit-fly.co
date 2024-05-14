import 'dotenv/config'
import { z } from 'zod'

const envSchema = z.object({
  JWT_SECRET: z.string(),
})
const _env = envSchema.safeParse(process.env)

if (_env.success === false) {
  console.error('Env vars not found', _env.error.format)
  throw new Error('Env vars not found')
}

export const env = _env.data
