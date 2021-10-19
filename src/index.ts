import { createServer } from 'http'

import config from '@config'

import { app } from './http'

console.clear()

const httpServer = createServer(app)

httpServer.on('error', err => {
  console.log(`\nHTTP SERVER: ERROR > ${err.message}`)
})

httpServer.listen(config.HTTP_SERVER_PORT)

console.log(`\nAPI: LISTENING ON PORT ${config.HTTP_SERVER_PORT}`)
