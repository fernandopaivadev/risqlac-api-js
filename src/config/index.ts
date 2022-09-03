import { config as dotenvConfig } from 'dotenv'

import { Config } from '../@types'

dotenvConfig()

const config: Config = {
  JWT_SECRET: '0834j3f289j028jd28ejd028e',
  JWT_EXP_TIME: 86400000, // 1 day

  DATABASE_URL: process.env.DATABASE_URL ?? '',

  EMAIL_CONFIG_HOST: process.env.EMAIL_CONFIG_HOST ?? '',
  EMAIL_CONFIG_PORT: Number(process.env.EMAIL_CONFIG_PORT),
  EMAIL_CONFIG_AUTH_USER: process.env.EMAIL_CONFIG_AUTH_USER ?? '',
  EMAIL_CONFIG_AUTH_PASS: process.env.EMAIL_CONFIG_AUTH_PASS ?? ''
}

export default config
