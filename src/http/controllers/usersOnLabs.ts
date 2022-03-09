
import { NextFunction, Response } from 'express'

import { prisma } from '@database'
import { CustomRequest } from '@types'

export default {
  create: async (req: CustomRequest, res: Response, next: NextFunction): Promise<void> => {
    const { user } = req

    const body = {
      ...req.body
    }

    if (user?.is_admin) {
      if (user.labs.find(lab =>
        (lab.lab_id === body.lab_id) && (lab.access_level === 'admin')
      )) {
        await prisma.users_on_labs.create({
          data: body
        }).catch((err: Error) => {
          next(err)
        })

        res.status(201).json({ message: 'user on lab relation created' })
      } else {
        res.status(403).json({ message: 'user does not have admin access in this lab' })
      }
    } else {
      res.status(403).json({ message: 'admin access only' })
    }
  },

  update: async (req: CustomRequest, res: Response, next: NextFunction): Promise<void> => {
    const { user } = req

    const body = {
      ...req.body
    }

    if (user?.is_admin) {
      if (user.labs.find(lab =>
        (lab.lab_id === body.lab_id) && (lab.access_level === 'admin')
      )) {
        await prisma.users_on_labs.update({
          where: {
            user_id_lab_id: body.user_id_lab_id
          },
          data: body
        }).catch((err: Error) => {
          next(err)
        })

        res.status(201).json({ message: 'user on lab relation created' })
      } else {
        res.status(403).json({ message: 'user does not have admin access in this lab' })
      }
    } else {
      res.status(403).json({ message: 'admin access only' })
    }
  }
}