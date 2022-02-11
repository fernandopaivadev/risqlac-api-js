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

      await prisma.product.create({
        data: body
      }).catch((err: Error) => {
        next(err)
      })

      res.status(201).json({ message: 'product created' })
    } else {
      res.status(403).json({ message: 'admin access only' })
    }
  },

  list: async (req: CustomRequest, res: Response, next: NextFunction): Promise<void> => {
    const id = req.query?.id

    if (id) {
      const products = await prisma.product.findMany({
        where: {
          lab_id: String(id)
        },
        select: {
          id: true,
          name: true,
          class: true
        }
      }).catch((err: Error) => {
        next(err)
      })

      if (products) {
        res.status(200).json({ products })
      } else {
        res.status(404).json({ message: 'products not found' })
      }
    } else {
      res.status(412).json({ message: 'missing arguments' })
    }
  },

  data: async (req: CustomRequest, res: Response, next: NextFunction): Promise<void> => {
    const id = req.query?.id

    if (id) {
      const product = await prisma.product.findUnique({
        where: {
          id: String(id)
        }
      }).catch((err: Error) => {
        next(err)
      })

      if (product) {
        res.status(200).json({ product })
      } else {
        res.status(404).json({ message: 'product not found' })
      }
    } else {
      res.status(412).json({ message: 'missing arguments' })
    }
  },

  update: async (req: CustomRequest, res: Response, next: NextFunction): Promise<void> => {
    const { user } = req

    const id = req.body?.id

    if (id) {
      const body = {
        ...req.body
      }

      const product = await prisma.product.findUnique({
        where: {
          id: String(id)
        }
      }).catch((err: Error) => {
        next(err)
      })

      if (product) {
        const userHasPermission = await prisma.users_on_labs.findFirst({
          where: {
            AND: {
              user_id: user?.id,
              lab_id: String(product.lab_id),
              access_level: 'admin'
            }
          }
        }).catch((err: Error) => {
          next(err)
        })

        if (userHasPermission) {
          await prisma.product.update({
            where: {
              id: String(id)
            },
            data: body
          }).catch((err: Error) => {
            next(err)
          })

          res.status(200).json({ message: 'product updated' })
        } else {
          res.status(403).json({ message: 'admin access only' })
        }
      } else {
        res.status(404).json({ message: 'product not found' })
      }
    } else {
      res.status(412).json({ message: 'missing arguments' })
    }
  },

  delete: async (req: CustomRequest, res: Response, next: NextFunction): Promise<void> => {
    const { user } = req

    const id = req.query?.id

    if (id) {
      const product = await prisma.product.findUnique({
        where: {
          id: String(id)
        }
      }).catch((err: Error) => {
        next(err)
      })

      if (product) {
        const userHasPermission = await prisma.users_on_labs.findFirst({
          where: {
            AND: {
              user_id: user?.id,
              lab_id: String(product.lab_id),
              access_level: 'admin'
            }
          }
        }).catch((err: Error) => {
          next(err)
        })

        if (userHasPermission) {
          await prisma.product.delete({
            where: {
              id: String(id)
            }
          }).catch((err: Error) => {
            next(err)
          })

          res.status(200).json({ message: 'product deleted' })
        } else {
          res.status(403).json({ message: 'admin access only' })
        }
      } else {
        res.status(404).json({ message: 'product not found' })
      }
    } else {
      res.status(412).json({ message: 'missing arguments' })
    }
  }
}
