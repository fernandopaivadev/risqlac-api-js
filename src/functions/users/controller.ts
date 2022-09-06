import { hash, compare } from 'bcrypt'
import { sign, verify } from 'jsonwebtoken'

import { Functions } from '../../@types'
import config from '../../config'
import { prisma } from '../../database'
import { sendEmail } from '../../services'

export default {
  login: async (req, res, next) => {
    const username = req.query.username
    const password = req.query.password

    if (username && password) {
      const user = await prisma.user
        .findFirst({
          where: {
            OR: [{ email: String(username) }, { username: String(username) }]
          }
        })
        .catch((err: Error) => {
          next({ err })
        })

      if (user) {
        const isValid = await compare(String(password), user.hashed_password)

        if (isValid) {
          const secret = config.JWT_SECRET
          const expTime = config.JWT_EXP_TIME
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
      const user = await prisma.user
        .findFirst({
          where: {
            OR: [{ email: String(username) }, { username: String(username) }]
          }
        })
        .catch((err: Error) => {
          next({ err })
        })

      if (user) {
        const secret = config.JWT_SECRET
        const expTime = 300000 // 5 minutes

        const token = sign(
          {
            id: user.id
          },
          secret,
          { expiresIn: expTime }
        )

        const subject = 'RisqLAC - Recuperação de Senha'

        sendEmail({
          from: config.EMAIL_CONFIG_AUTH_USER,
          to: user.email,
          subject,
          template: 'resetPassword',
          data: {
            token
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
    const token: string = tokenFromBody
      ? tokenFromBody
      : req.headers.authorization?.split(' ')[1]

    if (token) {
      verify(token, config.JWT_SECRET, async (err, payload: any) => {
        if (err) {
          next({ err })
        } else {
          const password = String(req.body.password)
          const id = Number(payload?.id)

          if (password && id) {
            if (password.length < 8) {
              next({
                err: new Error('invalid password')
              })
            }

            const user = await prisma.user
              .findUnique({
                where: {
                  id
                }
              })
              .catch((err: Error) => {
                next({ err })
              })

            if (user) {
              const hashed_password = await hash(
                password,
                Math.floor(Math.random() * 10 + 10)
              )

              if (
                await prisma.user
                  .update({
                    where: {
                      id: Number(id)
                    },
                    data: {
                      hashed_password
                    }
                  })
                  .catch((err: Error) => {
                    next({
                      err
                    })
                  })
              ) {
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

  list: async (req, res, next) => {
    const { user } = req

    const query = user?.is_admin ? {} : { id: user?.id }

    const users = await prisma.user
      .findMany({
        select: {
          id: true,
          is_admin: true,
          name: true,
          username: true,
          email: true,
          phone: true,
          created_at: true,
          updated_at: true
        },
        orderBy: {
          is_admin: 'asc'
        },
        where: {
          ...query
        }
      })
      .catch((err: Error) => {
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
  },

  create: async (req, res, next) => {
    const { user } = req
    const body = {
      ...req.body
    }

    if (user?.is_admin) {
      const generatedPassword = Math.random().toString(32).slice(2)

      body.hashed_password = await hash(
        generatedPassword,
        Math.floor(Math.random() * 10 + 10)
      )

      body.created_at = new Date()
      body.updated_at = new Date()

      const personToCreate = body.people[0]
      const companyToCreate = body.companies[0]

      delete body.password
      delete body.people
      delete body.companies

      const data = companyToCreate
        ? {
            ...body,
            people: {
              create: {
                birth: new Date(personToCreate.birth),
                cpf: personToCreate.cpf,
                name: personToCreate.name,
                created_at: new Date(),
                updated_at: new Date()
              }
            },
            companies: {
              create: {
                cnpj: companyToCreate.cnpj,
                description: companyToCreate.description,
                name: companyToCreate.name,
                trade_name: companyToCreate.trade_name,
                created_at: new Date(),
                updated_at: new Date()
              }
            }
          }
        : {
            ...body,
            people: {
              create: {
                birth: new Date(personToCreate.birth),
                cpf: personToCreate.cpf,
                name: personToCreate.name,
                created_at: new Date(),
                updated_at: new Date()
              }
            }
          }

      if (
        await prisma.user
          .create({
            data
          })
          .catch((err: Error) => {
            next({
              err
            })
          })
      ) {
        sendEmail({
          from: config.EMAIL_CONFIG_AUTH_USER,
          to: body.email,
          subject: 'Bem vindo ao RisqLAC',
          template: 'userCreate',
          data: {
            email: body.email,
            username: body.username,
            password: generatedPassword
          }
        })

        next({
          status: 201,
          data: {
            generatedPassword
          }
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
      if (
        await prisma.user
          .update({
            where: {
              id: Number(body.id)
            },
            data: body
          })
          .catch((err: Error) => {
            next({
              err
            })
          })
      ) {
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

  delete: async (req, res, next) => {
    const { user } = req
    const id = req.query.id

    if (id) {
      if (user?.is_admin) {
        if (
          await prisma.user
            .delete({
              where: {
                id: Number(id)
              }
            })
            .catch((err: Error) => {
              next({
                err
              })
            })
        ) {
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
} as Functions.Controllers.Users
