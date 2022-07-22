import { Middleware } from '../@types'
import { log } from '../services'

const SendResponse: Middleware.SendResponse = async (
  { status, data, err }, req, res, next
) => {
  if (!res.headersSent) {
    if (err) {
      log.error('CONTROLLER', err)
      res.status(500).json({
        error: {
          route: req.path,
          message: err.message
        }
      })
    } else if (status) {
      res.status(status).json(data)
    }
  }
}

export default SendResponse
