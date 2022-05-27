import { hash, compare } from 'bcrypt'
import { sign, verify } from 'jsonwebtoken'

import config from '@config'
import { prisma } from '@database'
import { sendEmail } from '@shared'
import { App } from '@types'

export default {
  login: async (req, res, next) => {
    const username = req.query.username
    const password = req.query.password

    if (username && password) {
      const user = await prisma.user.findFirst({
        where: {
          OR: [
            { email: String(username) },
            { username: String(username) }
          ]
        }
      }).catch((err: Error) => {
        next({ err })
      })

      if (user) {
        const isValid = await compare(
          String(password),
          user.hashed_password
        )

        if (isValid) {
          const { secret, expTime } = config.JWT

          const token = sign(
            {
              id: user.id
            },
            secret,
            {
              expiresIn: expTime
            }
          )

          next({
            status: 200,
            data: {
              token
            }
          })
        } else {
          next({
            status: 401
          })
        }
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

  forgotPassword: async (req, res, next) => {
    const username = req.query.username

    if (username) {
      const user = await prisma.user.findFirst({
        where: {
          OR: [
            { email: String(username) },
            { username: String(username) }
          ]
        }
      }).catch((err: Error) => {
        next({ err })
      })

      if (user) {
        const { secret, expTime } = config.RECOVERY_JWT

        const token = sign(
          {
            id: user.id
          },
          secret,
          { expiresIn: expTime }
        )

        const resetPasswordLink = `${
          config.RESET_PASSWORD_LINK
        }?token${
          token
        }`

        const subject = 'TechAmazon - Recuperação de Senha'

        await sendEmail({
          from: config.EMAIL_CONFIG.auth.user,
          to: user.email,
          subject,
          template: 'resetPassword',
          data: {
            resetPasswordLink
          }
        })

        next({
          status: 202
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

  resetPassword: async (req, res, next) => {
    const tokenFromBody = req.body.token
    const token: string = tokenFromBody ? tokenFromBody : req.headers.authorization?.split(' ')[1]
    const secret = tokenFromBody ? config.RECOVERY_JWT.secret : config.JWT.secret

    if (token) {
      verify(token, secret, async (err, payload: any) => {
        if (err) {
          next({ err })
        } else {
          const password = String(req.body.password)
          const id = String(payload?.id)

          if (password && id) {
            if (password.length < 8) {
              next({
                err: new Error('invalid password')
              })
            }

            const user = await prisma.user.findUnique({
              where: {
                id
              }
            }).catch((err: Error) => {
              next({ err })
            })

            if (user) {
              const hashed_password = await hash(
                password,
                Math.floor(Math.random() * 10 + 10)
              )

              if (await prisma.user.update({
                where: {
                  id: String(id)
                },
                data: {
                  hashed_password
                }
              }).catch((err: Error) => {
                next({
                  err
                })
              })) {
                next({
                  status: 200
                })
              }
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
        }
      })
    } else {
      next({
        status: 412
      })
    }
  },

  list: async (req, res, next): Promise<void> => {
    const { user } = req

    if (user?.is_admin) {
      const users = await prisma.user.findMany({
        select: {
          id: true,
          username: true,
          email: true,
          phone: true,
          is_admin: true
        },
        orderBy: {
          is_admin: 'asc'
        }
      }).catch((err: Error) => {
        next({ err })
      })

      if (users) {
        next({
          status: 200,
          data: { users }
        })
      } else {
        next({
          status: 404
        })
      }
    } else {
      next({
        status: 403
      })
    }
  },

  data: async (req, res, next): Promise<void> => {
    const { user } = req
    const id = req.query.id

    const targetUser = await prisma.user.findUnique({
      where: {
        id: String(id && (user?.is_admin) ? id : user?.id)
      },
      select: {
        id: true,
        is_admin: true,
        email: true,
        username: true,
        phone: true
      }
    }).catch((err: Error) => {
      next({
        err
      })
    })

    if (targetUser) {
      next({
        status: 200,
        data: {
          user: targetUser
        }
      })
    } else {
      next({
        status: 404
      })
    }
  },

  create: async (req, res, next): Promise<void> => {
    const { user } = req
    const body = {
      ...req.body
    }

    if (user?.is_admin) {
      body.hashed_password = await hash(
        body.password.length >= 8 ? body.password : 'Risqlac+2022',
        Math.floor(Math.random() * 10 + 10)
      )

      delete body.password
      body.created_at, body.updated_at = new Date()

      if (await prisma.user.create({
        data: body
      }).catch((err: Error) => {
        next({
          err
        })
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

  update: async (req, res, next) => {
    const { user } = req
    const body = {
      ...req.body
    }

    if (user?.is_admin) {
      if (await prisma.user.update({
        where: {
          id: String(body.id)
        },
        data: body
      }).catch((err: Error) => {
        next({
          err
        })
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
  },

  delete: async (req, res, next): Promise<void> => {
    const { user } = req
    const id = req.query.id

    if (id) {
      if (user?.is_admin) {
        if (await prisma.user.delete({
          where: {
            id: String(id)
          }
        }).catch((err: Error) => {
          next({
            err
          })
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
} as App.Controllers.Users
