import configFile from '../../config.json'

const config: {
  HTTP_SERVER_PORT: string
  DATABASE_URL: string
  JWT: { secret: string, expTime: string }
  RECOVERY_JWT: { secret: string, expTime: string }
  SUPPORT_EMAIL: {
    host: string
    email: string
    password: string
  }
  RESET_PASSWORD_LINK: string
} = configFile

export default config
