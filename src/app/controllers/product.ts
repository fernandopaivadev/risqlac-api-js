import { prisma } from '@database'
import { App } from '@types'

export default {
  create: async (req, res, next) => {
    const { user } = req

    if (user?.is_admin) {
      const body = {
        ...req.body
      }

      body.updated_at, body.created_at = new Date()

      if (await prisma.product.create({
        data: body
      }).catch((err: Error) => {
        next({ err })
      })) {
        next({
          status: 201
        })
      }
    } else {
      next({
        status: 403
      })
    }
  },

  list: async (req, res, next) => {
    const products = await prisma.product.findMany({
      select: {
        id: true,
        name: true,
        class: true
      }
    }).catch((err: Error) => {
      next({ err })
    })

    if (products) {
      next({
        status: 200,
        data: {
          products
        }
      })
    } else {
      next({
        status: 404
      })
    }
  },

  data: async (req, res, next) => {
    const id = req.query.id

    if (id) {
      const product = await prisma.product.findUnique({
        where: {
          id: String(id)
        }
      }).catch((err: Error) => {
        next({ err })
      })

      if (product) {
        next({
          status: 200,
          data: {
            product
          }
        })
      } else {
        next({
          status: 404
        })
      }
    } else {
      next({
        status: 412
      })
    }
  },

  update: async (req, res, next) => {
    const { user } = req
    const id = req.body?.id

    if (id) {
      const body = {
        ...req.body
      }

      body.updated_at = new Date()

      if (user?.is_admin) {
        if (await prisma.product.update({
          where: {
            id: String(id)
          },
          data: body
        }).catch((err: Error) => {
          next({ err })
        })) {
          next({
            status: 200
          })
        }
      } else {
        next({
          status: 403
        })
      }
    } else {
      next({
        status: 412
      })
    }
  },

  delete: async (req, res, next) => {
    const { user } = req
    const id = req.query.id

    if (id) {
      if (user?.is_admin) {
        if (await prisma.product.delete({
          where: {
            id: String(id)
          }
        }).catch((err: Error) => {
          next({ err })
        })) {
          next({
            status: 200
          })
        }
      } else {
        next({
          status: 403
        })
      }
    } else {
      next({
        status: 412
      })
    }
  }
} as App.Controllers.Products
