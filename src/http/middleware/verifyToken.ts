import { Response, NextFunction } from 'express'
import { verify } from 'jsonwebtoken'
import { stdout } from 'process'

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

    verify(token, secret, (err, payload: any) => {
      if (err) {
        stdout.write(`VERIFY TOKEN: ERROR > ${err.message}`)
        res.status(401).json({ message: err.message })
      } else {
        const id = String(payload?.id)
        req.userId = id
        next()
      }
    })
  } else {
    stdout.write('VERIFY TOKEN: ERROR > missing token')
    res.status(401).json({ message: 'missing token' })
  }
}
