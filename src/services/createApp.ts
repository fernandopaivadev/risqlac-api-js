import compression from 'compression'
import cors from 'cors'
import express, { json, urlencoded } from 'express'
import helmet from 'helmet'

import { Services } from '../@types'

const createApp: Services.CreateApp = router => {
  const app = express()

  app.use(
    cors({
      origin: '*',
      optionsSuccessStatus: 200
    })
  )
  app.use(compression())
  app.use(helmet())
  app.use(json())
  app.use(urlencoded({ extended: true }))

  app.use('/', router)

  return app
}

export default createApp
