import { hash, compare } from 'bcrypt'
import { Request, Response } from 'express'
import { sign, verify } from 'jsonwebtoken'
import { createTransport } from 'nodemailer'

import config from '@config'
import { prisma } from '@database'
import { user } from '@prisma/client'
import { CustomRequest } from '@types'

export default {
  auth: async (req: Request, res: Response): Promise<void> => {
    let user: user | null | void = null
    const username = req.query?.username
    const password = req.query?.password

    if (username && password) {
      if (String(username).split('').includes('@')) {
        user = await prisma.user.findFirst({
          where: {
            email: String(username)
          }
        }).catch((err: any) => {
          res.status(500).json({ message: err.message })
          return
        })
      } else {
        user = await prisma.user.findFirst({
          where: {
            username: String(username)
          }
        }).catch((err: any) => {
          res.status(500).json({ message: err.message })
          return
        })
      }

      if (user) {
        const isValid = await compare(
          String(password),
          user.hashed_password
        )

        if (isValid) {
          await prisma.refresh_tokens.deleteMany({
            where: {
              user_id: user.id
            }
          }).catch((err: any) => {
            res.status(500).json({ message: err.message })
            return
          })

          const refreshToken = await prisma.refresh_tokens.create({
            data: {
              expiresIn:
                String(new Date().getTime() +
                config.REFRESH_TOKEN.expTime),
              user_id: user.id
            }
          }).catch((err: any) => {
            res.status(500).json({ message: err.message })
            return
          })

          const { secret, expTime } = config.JWT

          const token = sign(
            {
              id: user.id
            },
            secret,
            { expiresIn: expTime }
          )

          res.status(200).json({
            token,
            refreshToken
          })
        } else {
          res.status(401).json({ message: 'incorrect password' })
        }
      } else {
        res.status(404).json({ message: 'user not found' })
      }
    } else {
      res.status(412).json({ message: 'missing arguments' })
    }
  },

  refreshToken: async (req: Request, res: Response): Promise<void> => {
    const id = req.query?.uuid

    if (id) {
      const refreshToken = await prisma.refresh_tokens.findFirst({
        where: {
          id: String(id)
        }
      }).catch((err: any) => {
        res.status(500).json({ message: err.message })
        return
      })

      if (refreshToken) {
        const currentTime = new Date().getTime()
        const expiresIn = Number(refreshToken.expiresIn)

        await prisma.refresh_tokens.delete({
          where: {
            id: refreshToken.id
          }
        }).catch((err: any) => {
          res.status(500).json({ message: err.message })
          return
        })

        if (currentTime <= expiresIn) {
          const newRefreshToken = await prisma.refresh_tokens.create({
            data: {
              expiresIn:
                String(new Date().getTime() +
                config.REFRESH_TOKEN.expTime),
              user_id: refreshToken.user_id
            }
          }).catch((err: any) => {
            res.status(500).json({ message: err.message })
            return
          })

          const { secret, expTime } = config.JWT

          const token = sign(
            {
              id: refreshToken.user_id
            },
            secret,
            { expiresIn: expTime }
          )

          res.status(200).json({
            token,
            refreshToken: newRefreshToken
          })
        } else {
          res.status(401).json({ message: 'refresh token expired' })
        }
      } else {
        res.status(404).json({ message: 'refresh token not found' })
      }
    } else {
      res.status(412).json({ message: 'missing arguments' })
    }
  },

  forgotPassword: async (req: Request, res: Response): Promise<void> => {
    let user: user | null | void = null
    const username = req.query?.username

    if (username) {
      if (String(username).split('').includes('@')) {
        user = await prisma.user.findFirst({
          where: {
            email: String(username)
          }
        }).catch((err: any) => {
          res.status(500).json({ message: err.message })
          return
        })
      } else {
        user = await prisma.user.findFirst({
          where: {
            username: String(username)
          }
        }).catch((err: any) => {
          res.status(500).json({ message: err.message })
          return
        })
      }

      if (user) {
        const { host, email, password } = config.SUPPORT_EMAIL

        const transporter = createTransport({
          host,
          port: 587,
          secure: false,
          auth: {
            user: email,
            pass: password
          }
        })

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
        }?token=${
          token
        }`

        await transporter.sendMail({
          from: email,
          to: user.email,
          subject: 'Tech Amazon - Recuperação de Senha',
          text: `Clique no link abaixo para redefinir sua senha:\n\n${resetPasswordLink
          }`,
          html: `Clique no link abaixo para redefinir sua senha:\n\n${resetPasswordLink
          }`
        })

        res.status(200).json({ message: 'recovery email sent' })
      } else {
        res.status(412).json({ message: 'missing arguments' })
      }
    } else {
      res.status(404).json({ message: 'user not found' })
    }
  },

  resetPassword: async (req: Request, res: Response): Promise<void> => {
    let token: string | undefined | null
    let secret: string | undefined | null

    if (req.body.token) {
      token = req.body.token
      secret = config.RECOVERY_JWT.secret
    } else {
      token = req.headers.authorization?.split(' ')[1]
      secret = config.JWT.secret
    }

    if (token) {
      const { password } = req.body
      const payload: any = verify(token, secret)
      const { id } = payload

      const user = await prisma.user.findUnique({
        where: {
          id
        }
      }).catch((err: any) => {
        res.status(500).json({ message: err.message })
        return
      })


      if (user) {
        const hashed_password = await hash(
          password,
          Math.floor(Math.random() * 10 + 10)
        )

        await prisma.user.update({
          where: {
            id
          },
          data: {
            hashed_password
          }
        }).catch((err: any) => {
          res.status(500).json({ message: err.message })
          return
        })

        res.status(200).json({ message: 'password changed' })
      } else {
        res.status(404).json({ message: 'user not found' })
      }
    } else {
      res.status(400).json({ message: 'missing token' })
    }
  },

  list: async (req: CustomRequest, res: Response): Promise<void> => {
    const { user } = req

    if (user?.is_admin) {
      const users = await prisma.user.findMany({
        select: {
          id: true,
          username: true,
          email: true,
          phone: true,
          is_admin: true
        }
      }).catch((err: any) => {
        res.status(500).json({ message: err.message })
        return
      })

      if (users) {
        res.status(200).json({ users })
      } else {
        res.status(404).json({ message: 'users not found' })
      }
    } else {
      res.status(403).json({ message: 'admin access only' })
    }
  },

  data: async (req: CustomRequest, res: Response): Promise<void> => {
    const { user } = req
    const targetUserId = req.query?.id

    if (user?.is_admin && targetUserId) {
      const targetUser = await prisma.user.findUnique({
        where: {
          id: String(targetUserId)
        },
        select: {
          id: true,
          is_admin: true,
          email: true,
          username: true,
          phone: true
        }
      }).catch((err: any) => {
        res.status(500).json({ message: err.message })
        return
      })

      if (targetUser) {
        res.status(200).json({
          user: targetUser
        })
      } else {
        res.status(404).json({ message: 'user not found' })
      }
    }
  },

  create: async (req: CustomRequest, res: Response): Promise<void> => {
    req.body.hashed_password = await hash(
      req.body.password,
      Math.floor(Math.random() * 10 + 10)
    )

    const newUser = {
      ...req.body
    }

    delete newUser.password

    if (newUser.is_admin && !req.user?.is_admin) {
      delete newUser.is_admin
    }

    await prisma.user.create({
      data: newUser
    }).catch((err: any) => {
      res.status(500).json({ message: err.message })
      return
    })

    res.status(201).json({ message: 'user created' })
  },

  update: async (req: CustomRequest, res: Response): Promise<void> => {
    const { user } = req
    const targetUserId = req.body.id

    if (targetUserId) {
      const targetUser = await prisma.user.findUnique({
        where: {
          id: String(targetUserId)
        }
      }).catch((err: any) => {
        res.status(500).json({ message: err.message })
        return
      })

      if (targetUser) {
        if (user?.is_admin || targetUser.id === user?.id) {
          const body = {
            ...req.body
          }

          const newUser = {
            id: body.id,
            username: body.username,
            is_admin: body.is_admin,
            email: body.email,
            phone: body.phone,
            updated_at: new Date()
          }

          if (!req.user?.is_admin) {
            delete newUser.is_admin
          }

          await prisma.user.update({
            where: {
              id: targetUser.id
            },
            data: newUser
          }).catch((err: any) => {
            res.status(500).json({ message: err.message })
            return
          })

          res.status(200).json({ message: 'target user updated' })
        } else {
          res.status(403).json({ message: 'admin access only' })
        }
      } else {
        res.status(404).json({ message: 'target user not found' })
      }
    } else {
      res.status(412).json({ message: 'missing arguments' })
    }
  },

  delete: async (req: CustomRequest, res: Response): Promise<void> => {
    const { user } = req
    const targetUserId = req.query?.id

    if (targetUserId) {
      const targetUser = await prisma.user.findUnique({
        where: {
          id: String(targetUserId)
        }
      }).catch((err: any) => {
        res.status(500).json({ message: err.message })
        return
      })

      if (targetUser) {
        if (user?.is_admin || targetUser.id === user?.id) {
          await prisma.user.delete({
            where: {
              id: targetUser.id
            }
          }).catch((err: any) => {
            res.status(500).json({ message: err.message })
            return
          })

          res.status(200).json({ message: 'target user deleted' })
        } else {
          res.status(403).json({ message: 'admin access only' })
        }
      } else {
        res.status(404).json({ message: 'target user not found' })
      }
    } else {
      res.status(412).json({ message: 'missing arguments' })
    }
  }
}
