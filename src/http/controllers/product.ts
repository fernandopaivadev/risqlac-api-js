import { Response } from 'express'

import { prisma } from '@database'
import { CustomRequest } from '@types'

export default {
  create: async (req: CustomRequest, res: Response): Promise<void> => {
    const body = {
      ...req.body
    }

    await prisma.product.create({
      data: body
    }).catch((err: any) => {
      res.json(500).json({ message: err.message})
    })

    res.json(201).json({ message: 'product created' })
  },

  list: async (req: CustomRequest, res: Response): Promise<void> => {
    const products = await prisma.product.findMany()

    if (products.length) {
      res.status(200).json({ products })
    } else {
      res.status(404).json({ message: 'products not found' })
    }
  },

  data: async (req: CustomRequest, res: Response): Promise<void> => {
    const id = req.query?.id

    if (id) {
      const product = await prisma.product.findUnique({
        where: {
          id: String(id)
        }
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

  update: async (req: CustomRequest, res: Response): Promise<void> => {
    const id = req.query?.id

    if (id) {
      const body = {
        ...req.body
      }

      const product = await prisma.product.update({
        where: {
          id: String(id)
        },
        data: body
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

  delete: async (req: CustomRequest, res: Response): Promise<void> => {
    const { user } = req

    if (user?.is_admin) {
      const id = req.query?.id

      if (id) {
        const product = await prisma.product.delete({
          where: {
            id: String(id)
          }
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
