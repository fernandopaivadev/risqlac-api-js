import compression from 'compression'
import cors from 'cors'
import express, { json, urlencoded } from 'express'
import helmet from 'helmet'
import morgan from 'morgan'

import { Services } from '../@types'

const genereteApp: Services.GenerateApp = (router) => {
  const app = express()

  app.use(cors({
    origin: '*',
    optionsSuccessStatus: 200
  }))
  app.use(compression())
  app.use(helmet())
  app.use(json())
  app.use(urlencoded({ extended: true }))
  app.use(morgan('tiny', {
    skip: (req, res) => req.path === '/user/login'
  }))

  app.use('/', router)

  return app
}

export default genereteApp
