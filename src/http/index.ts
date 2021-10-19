import compression from 'compression'
import cors from 'cors'
import express, { json, urlencoded } from 'express'
import helmet from 'helmet'
import morgan from 'morgan'
import { serve, setup } from 'swagger-ui-express'

import { swaggerFile, swaggerConfig } from '../docs'
import { routes } from './routes'

const app = express()

app.use(compression())
app.use(cors({
  origin: '*',
  optionsSuccessStatus: 200
}))
app.use(helmet())
app.use(json())
app.use(urlencoded({ extended: true }))
app.use(morgan('combined'))

app.use('/', routes)

app.use('/', serve, setup(swaggerFile, swaggerConfig))

export {
  app
}
