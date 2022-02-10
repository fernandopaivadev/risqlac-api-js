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

    res.status(200).json({ labs })
  },

  update: async (req: CustomRequest, res: Response, next: NextFunction): Promise<void> => {
    const { user } = req

    const id = req.body?.id

    if (id) {
      const lab = await prisma.lab.findFirst({
        where: {
          id: String(id),
          users: {
            some: {
              AND: {
                user_id: user?.id,
                access_level: 'admin'
              }
            }
          }
        }
      })

      if (lab) {
        const body = {
          ...req.body
        }

        const updatedLab = await prisma.lab.update({
          where: {
            id: lab?.id
          },
          data: body
        }).catch((err: Error) => {
          next(err)
        })

        if (updatedLab) {
          res.status(200).json({ lab: updatedLab })
        } else {
          res.status(404).json({ message: 'lab not found' })
        }
      } else {
        res.status(404).json({
          message: 'this lab does not exist or you do not have permission to modify it'
        })
      }
    } else {
      res.status(412).json({ message: 'missing arguments' })
    }
  },

  delete: async (req: CustomRequest, res: Response, next: NextFunction): Promise<void> => {
    const { user } = req

    if (user?.is_admin) {
      const id = req.query?.id

      if (id) {
        const lab = await prisma.lab.findFirst({
          where: {
            id: String(id),
            users: {
              some: {
                AND: {
                  user_id: user?.id,
                  access_level: 'admin'
                }
              }
            }
          }
        })

        if (lab) {
          const deletedLab = await prisma.lab.delete({
            where: {
              id: lab.id
            }
          }).catch((err: Error) => {
            next(err)
          })

          if (deletedLab) {
            res.status(200).json({ lab: deletedLab })
          } else {
            res.status(404).json({ message: 'lab not found' })
          }
        } else {
          res.status(404).json({
            message: 'this lab does not exist or you do not have permission to modify it'
          })
        }
      } else {
        res.status(412).json({ message: 'missing arguments' })
      }
    } else {
      res.status(403).json({ message: 'admin access only' })
    }
  }
}
