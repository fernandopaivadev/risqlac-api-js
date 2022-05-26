import { prisma } from '@database'
import { App } from '@types'

const verifyUser: App.Middleware.VerifyUser = async (req, res, next) => {
  if (req.userId) {
    const user = await prisma.user.findUnique({
      where: {
        id: req.userId
      },
      select: {
        id: true,
        is_admin: true,
        email: true,
        username: true,
        phone: true,
        created_at: true,
        updated_at: true
      }
    }).catch((err: Error) => {
      res.status(500).json({
        error: {
          route: req.path,
          message: err.message
        }
      })
    })

    req.user = user
    next()
  } else {
    res.status(401).send()
  }
}

export default verifyUser
