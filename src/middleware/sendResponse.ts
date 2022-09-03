import { Middleware } from '../@types'
import { log } from '../services'

const SendResponse: Middleware.SendResponse = async (
  { status, data, err },
  req,
  res,
  next
) => {
  if (!res.headersSent) {
    const _status = err || !status ? 500 : status
    const _data = err
      ? {
          error: {
            route: req.path,
            message:
              typeof err.message === 'object'
                ? JSON.stringify(err, null, 2)
                : err.message
          }
        }
      : data

    log.info('RESPONSE', {
      status: _status,
      data: _data
    })

    res.status(_status).json(_data)
  }
}

export default SendResponse
