import { NextFunction, Response } from 'express'

import { prisma } from '@database'
import { CustomRequest } from '@types'

export default {
  create: async (req: CustomRequest, res: Response, next: NextFunction): Promise<void> => {
    const { user } = req

    if (user?.is_admin) {
      const body = {
        ...req.body
      }

      await prisma.lab.create({
        data: body
      }).catch((err: Error) => {
        next(err)
      })

      res.status(201).json({ message: 'lab created' })
    } else {
      res.status(403).json({ message: 'admin access only' })
    }
  },

  list: async (req: CustomRequest, res: Response, next: NextFunction): Promise<void> => {
    const labs = await prisma.lab.findMany()
      .catch((err: Error) => {
        next(err)
      })

    if (labs) {
      res.status(200).json({ labs })
    } else {
      res.status(404).json({ message: 'labs not found' })
    }

    res.status(200).json({ labs })
  },

  update: async (req: CustomRequest, res: Response, next: NextFunction): Promise<void> => {
    const { user } = req

    const id = req.body?.id

    if (id) {
      const lab = await prisma.lab.findUnique({
        where: {
          id: String(id)
        }
      })

      if (lab) {
        const body = {
          ...req.body
        }

        const userHasPermission = await prisma.users_on_labs.findFirst({
          where: {
            AND: {
              user_id: user?.id,
              lab_id: String(lab.id),
              access_level: 'admin'
            }
          }
        })

        if (userHasPermission) {
          await prisma.lab.update({
            where: {
              id: lab?.id
            },
            data: body
          }).catch((err: Error) => {
            next(err)
          })

          res.status(200).json({ message: 'lab updated' })
        } else {
          res.status(403).json({ message: 'admin access only' })
        }
      } else {
        res.status(404).json({ message: 'lab not found' })
      }
    } else {
      res.status(412).json({ message: 'missing arguments' })
    }
  },

  delete: async (req: CustomRequest, res: Response, next: NextFunction): Promise<void> => {
    const { user } = req

    const id = req.query?.id

    if (id) {
      const lab = await prisma.lab.findUnique({
        where: {
          id: String(id)
        }
      })

      if (lab) {
        const userHasPermission = await prisma.users_on_labs.findFirst({
          where: {
            AND: {
              user_id: user?.id,
              lab_id: String(lab.id),
              access_level: 'admin'
            }
          }
        })

        if (userHasPermission) {
          await prisma.lab.delete({
            where: {
              id: lab.id
            }
          }).catch((err: Error) => {
            next(err)
          })

          res.status(200).json({ message: 'lab deleted' })
        } else {
          res.status(403).json({ message: 'admin access only' })
        }
      } else {
        res.status(404).json({ message: 'lab not found' })
      }
    } else {
      res.status(412).json({ message: 'missing arguments' })
    }
  }
}
