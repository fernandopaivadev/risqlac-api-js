import compression from 'compression'
import cors from 'cors'
import express, { json, urlencoded } from 'express'
import helmet from 'helmet'
import morgan from 'morgan'

import { version, description } from '../../package.json'
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
app.use(morgan('common', {
  skip: (req, res) => req.path === '/user/login'
}))

app.use('/', routes)

app.get('/', (req, res) => {
  res.status(200).json({
    version,
    description
  })
})

export {
  app
}
