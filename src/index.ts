import { createServer } from 'http'
import { stdout } from 'process'

import config from '@config'

import { app } from './http'

console.clear()

const httpServer = createServer(app)

httpServer.on('error', err => {
  stdout.write(`\nHTTP SERVER: ERROR > ${err.message}`)
})

httpServer.listen(config.HTTP_SERVER_PORT)

stdout.write(`\nAPI: LISTENING ON PORT ${config.HTTP_SERVER_PORT}`)
