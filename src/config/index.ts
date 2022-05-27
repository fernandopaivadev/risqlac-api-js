import { config as dotenvConfig } from 'dotenv'

dotenvConfig()

const config: {
  HTTP_SERVER_PORT: string
  DATABASE_URL: string
  JWT: { secret: string, expTime: string }
  RECOVERY_JWT: { secret: string, expTime: string }
  EMAIL_CONFIG: {
    host: string
    port: string
    auth: {
      user: string
      pass: string
    }
  },
  RESET_PASSWORD_LINK: string
} = JSON.parse(process.env.CONFIG ?? '{}')

export default config
