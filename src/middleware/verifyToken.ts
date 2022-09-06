import { verify } from 'jsonwebtoken'

import { Middleware } from '../@types'
import config from '../config'

const verifyToken: Middleware.VerifyToken = async (req, res, next) => {
  const token: string | undefined = req.headers.authorization?.split(' ')[1]

  if (token) {
    const secret = config.JWT_SECRET

    verify(token, secret, (err, payload: any) => {
      if (err) {
        res.status(401).send()
      } else {
        console.log(payload)
        req.userId = Number(payload?.id)
        next()
      }
    })
  } else {
    res.status(401).send()
  }
}

export default verifyToken
