import { hash, compare } from 'bcrypt'
import { sign, verify } from 'jsonwebtoken'
import { createTransport } from 'nodemailer'

import config from '@config'
import { prisma } from '@database'
import { App } from '@types'

export default {
  login: async (req, res, next) => {
    const username = req.query?.username
    const password = req.query?.password

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
            { expiresIn: expTime }
          )

          res.status(200).json({
            token
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

  forgotPassword: async (req, res, next) => {
    const username = req.query?.username

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
          text: `Clique no link abaixo para redefinir sua senha:\n\n${
            resetPasswordLink
          }`,
          html: `Clique no link abaixo para redefinir sua senha:\n\n${
            resetPasswordLink
          }`
        })

        res.status(200).json({ message: 'recovery email sent' })
      } else {
        res.status(404).json({ message: 'user not found' })
      }
    }
    else {
      res.status(412).json({ message: 'missing arguments' })
    }
  },

  resetPassword: async (req, res, next) => {
    const tokenFromBody = req.body?.token

    const token = tokenFromBody ? tokenFromBody : req.headers.authorization?.split(' ')[1]
    const secret = tokenFromBody ? config.RECOVERY_JWT.secret : config.JWT.secret

    if (token) {
      const { password } = req.body
      const payload: any = verify(token, secret)
      const { id } = payload

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

        await prisma.user.update({
          where: {
            id
          },
          data: {
            hashed_password
          }
        }).catch((err: Error) => {
          next({ err })
        })

        res.status(200).json({ message: 'password changed' })
      } else {
        res.status(404).json({ message: 'user not found' })
      }
    } else {
      res.status(400).json({ message: 'missing token' })
    }
  },

  list: async (req, res, next) => {
    const { user } = req

    if (user?.is_admin) {
      const users = await prisma.user.findMany({
        select: {
          id: true,
          email: true,
          name: true,
          is_admin: true
        }
      }).catch((err: Error) => {
        next({ err })
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

  data: async (req, res, next) => {
    const { user } = req
    const targetUserId = req.query?.id

    if (user?.is_admin || user?.id === String(targetUserId)) {
      const targetUser = await prisma.user.findUnique({
        where: {
          id: user?.is_admin && targetUserId ?
            String(targetUserId)
            :
            user?.id
        },
        select: {
          id: true,
          is_admin: true,
          username: true,
          name: true,
          email: true,
          phone: true,
          created_at: true,
          updated_at: true,
          hashed_password: false
        }
      }).catch((err: Error) => {
        next({ err })
      })

      if (targetUser) {
        res.status(200).json({
          user: targetUser
        })
      } else {
        res.status(404).json({ message: 'user not found' })
      }
    } else {
      res.status(403).json({ message: 'admin access only' })
    }
  },

  create: async (req, res, next) => {
    const { user } = req
    const body = {
      ...req.body
    }

    body.hashed_password = await hash(
      body.password,
      Math.floor(Math.random() * 10 + 10)
    )

    delete body.password

    if (body.is_admin && !user?.is_admin) {
      delete body.is_admin
    }

    await prisma.user.create({
      data: body
    }).catch((err: Error) => {
      next({ err })
    })

    res.status(201).json({ message: 'user created' })
  },

  update: async (req, res, next) => {
    const { user } = req
    const targetUserId = req.body?.id

    const targetUser = await prisma.user.findUnique({
      where: {
        id: user?.is_admin && targetUserId ?
          String(targetUserId)
          :
          user?.id
      }
    }).catch((err: Error) => {
      next({ err })
    })

    if (targetUser) {
      const body = {
        ...req.body
      }

      if (!user?.is_admin) {
        delete body.is_admin
      }

      await prisma.user.update({
        where: {
          id: targetUser.id
        },
        data: {
          id: body.id,
          name: body.name,
          username: body.username,
          is_admin: body.is_admin,
          email: body.email,
          phone: body.phone,
          updated_at: new Date()
        }
      }).catch((err: Error) => {
        next({ err })
      })

      res.status(200).json({ message: 'user updated' })
    } else {
      res.status(404).json({ message: 'user not found' })
    }
  },

  delete: async (req, res, next) => {
    const { user } = req
    const targetUserId = req.body?.id

    const targetUser = await prisma.user.findUnique({
      where: {
        id: user?.is_admin && targetUserId ?
          String(targetUserId)
          :
          user?.id
      }
    }).catch((err: Error) => {
      next({ err })
    })

    if (targetUser) {
      await prisma.user.delete({
        where: {
          id: targetUser.id
        }
      }).catch((err: Error) => {
        next({ err })
      })

      res.status(200).json({ message: 'user deleted' })
    } else {
      res.status(404).json({ message: 'user not found' })
    }
  }
} as App.Controllers.Users
