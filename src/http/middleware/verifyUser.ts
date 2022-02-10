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
      res.status(500).json({ error: err })
    })

    if (user) {
      const labs = await prisma.lab.findMany({
        where: {
          users: {
            some: {
              user_id: user.id
            }
          }
        }
      }).catch((err: Error) => {
        res.status(500).json({ error: err })
      })

      const usersOnLabs = await prisma.users_on_labs.findMany({
        where: {
          user_id: user.id
        }
      })

      req.user = user

      if (labs && usersOnLabs) {
        req.labs = labs
        req.usersOnLabs = usersOnLabs
        next()
      } else {
        res.status(404).json({ error: new Error('labs not found') })
      }
    } else {
      res.status(404).json({ message: 'user not found' })
    }
  } else {
    res.status(401).json({ message: 'user not authenticated' })
  }
}
