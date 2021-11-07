import { Response, NextFunction } from 'express'
import { verify } from 'jsonwebtoken'

import config from '@config'
import { CustomRequest } from '@types'

export default (
  req: CustomRequest,
  res: Response,
  next: NextFunction
): void => {
  const token: string | undefined = req.headers.authorization?.split(' ')[1]

  if (token) {
    const { secret } = config.JWT

    verify(token, secret, (err, payload) => {
      if (err) {
        console.log(`VERIFY TOKEN: ERROR > ${err.message}`)
        res.status(401).json({ message: 'invalid token' })
      } else {
        const id = String(payload?.id)

        if (id) {
          req.userId = id
        } else {
          res.status(401).json({ message: 'invalid user id' })
        }
        next()
      }
    })
  } else {
    console.log('VERIFY TOKEN: ERROR > missing token')
    res.status(401).json({ message: 'missing token' })
  }
}
