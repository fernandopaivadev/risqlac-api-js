import { Response, NextFunction } from 'express'

import { prisma } from '@database'
import { CustomRequest } from '@types'

export default async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  if (req.userId) {
    const user = await prisma.user.findUnique({
      where: {
        id: String(req.userId)
      },
      select: {
        id: true,
        is_admin: true,
        email: true,
        name: true,
        username: true,
        phone: true,
        created_at: true,
        updated_at: true
      }
    }).catch((err: Error) => {
      next(err)
      return
    })

    if (user) {
      req.user = user
      next()
    } else {
      res.status(404).json({ message: 'user not found' })
    }
  } else {
    res.status(401).json({ message: 'user not authenticated' })
  }
}
