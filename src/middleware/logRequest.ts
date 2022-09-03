import { Middleware } from '../@types'
import { log } from '../services'

const logRequest: Middleware.LogRequest = async (req, res, next) => {
  const { path, headers, body, query } = req
  log.info('REQUEST', {
    path,
    headers,
    body,
    query
  })
  next()
}

export default logRequest
