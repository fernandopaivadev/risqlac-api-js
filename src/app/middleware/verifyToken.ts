import { verify } from 'jsonwebtoken'

import config from '@config'
import { App } from '@types'

const verifyToken: App.Middleware.VerifyToken = async (req, res, next) => {
  const token: string | undefined = req.headers.authorization?.split(' ')[1]

  if (token) {
    const { secret } = config.JWT

    verify(token, secret, (err, payload: any) => {
      if (err) {
        res.status(401).send()
      } else {
        const id = String(payload?.id)
        req.userId = id
        next()
      }
    })
  } else {
    res.status(401).send()
  }
}

export default verifyToken
