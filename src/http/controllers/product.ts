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
    const products = await prisma.product.findMany({
      select: {
        id: true,
        name: true,
        class: true,
        lab: true
      }
    }).catch((err: Error) => {
      next(err)
    })

    res.status(200).json({ products })
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

    if (user?.is_admin) {
      const id = req.body?.id

      if (id) {
        const body = {
          ...req.body
        }

        const product = await prisma.product.update({
          where: {
            id: String(id)
          },
          data: body
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
    } else {
      res.status(403).json({ message: 'admin access only' })
    }
  },

  delete: async (req: CustomRequest, res: Response, next: NextFunction): Promise<void> => {
    const { user } = req

    if (user?.is_admin) {
      const id = req.query?.id

      if (id) {
        const product = await prisma.product.delete({
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
    } else {
      res.status(403).json({ message: 'admin access only' })
    }
  }
}
