import { config as dotenvConfig } from 'dotenv'

import { Config } from '../@types'

dotenvConfig()

const config: Config = {
  DATABASE_URL: process.env.DATABASE_URL ?? '',

  JWT_SECRET: process.env.JWT_SECRET ?? '',
  JWT_EXP_TIME: process.env.JWT_EXP_TIME ?? '',
  RECOVERY_JWT_SECRET: process.env.RECOVERY_JWT_SECRET ?? '',
  RECOVERY_JWT_EXP_TIME: process.env.RECOVERY_JWT_EXP_TIME ?? '',

  SUPPORT_EMAIL: process.env.SUPPORT_EMAIL ?? '',

  EMAIL_CONFIG_HOST: process.env.EMAIL_CONFIG_HOST ?? '',
  EMAIL_CONFIG_PORT: Number(process.env.EMAIL_CONFIG_PORT),
  EMAIL_CONFIG_AUTH_USER: process.env.EMAIL_CONFIG_AUTH_USER ?? '',
  EMAIL_CONFIG_AUTH_PASS: process.env.EMAIL_CONFIG_AUTH_PASS ?? '',

  RESET_PASSWORD_LINK: process.env.RESET_PASSWORD_LINK ?? ''
}

export default config
