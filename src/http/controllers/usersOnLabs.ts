
import { NextFunction, Response } from 'express'

import { prisma } from '@database'
import { CustomRequest } from '@types'

export default {
  create: async (req: CustomRequest, res: Response, next: NextFunction): Promise<void> => {
    const { user } = req

    const body = {
      ...req.body
    }

    if (user?.is_admin) {
      if (await prisma.users_on_labs.create({
        data: {
          user_id: body.user_id,
          lab_id: body.lab_id,
          assigned_by: user.id,
          access_level: body.access_level
        }
      }).catch((err: Error) => {
        next(err)
      })) {
        res.status(201).json({ message: 'user on lab relation created' })
      }
    } else {
      res.status(403).json({ message: 'admin access only' })
    }
  }

  // update: async (req: CustomRequest, res: Response, next: NextFunction): Promise<void> => {
  //   const { user } = req
  //   const body = {
  //     ...req.body
  //   }
    
  //   const labId = body?.lab_id
  //   const userId = body?.user_id

  //   if (userId && labId) {
  //     if (user?.is_admin) {
  //       const usersOnLabs = await prisma.users_on_labs.findFirst({
  //         where: {
  //           AND: [
  //             { user_id: String(userId) },
  //             { lab_id: String(labId) }
  //           ]
  //         }
  //       })

  //       if (usersOnLabs) {
  //         if (await prisma.users_on_labs.update({
  //           where: {
              
  //           },
  //           data: body
  //         })) {
  //           res.status(200).json({ message: 'user on lab relation delete' })
  //         }
  //       } else {
  //         res.status(404).json({ message: 'user lab relation not found' })
  //       }
  //     } else {
  //       res.status(403).json({ message: 'admin access only' })
  //     }
  //   } else {
  //     res.status(412).json({ message: 'missing arguments' })
  //   }
  // },

  // delete: async (req: CustomRequest, res: Response, next: NextFunction): Promise<void> => {
  //   const { user } = req
  //   const userId = req.query?.user_id
  //   const labId = req.query?.lab_id

  //   if (userId && labId) {
  //     if (user?.is_admin) {
  //       const usersOnLabs = await prisma.users_on_labs.findFirst({
  //         where: {
  //           AND: [
  //             { user_id: String(userId) },
  //             { lab_id: String(labId) }
  //           ]
  //         }
  //       })

  //       if (usersOnLabs) {
  //         if (await prisma.users_on_labs.delete({
  //           where: {
  //             user_id_lab_id: ''
  //           }
  //         })) {
  //           res.status(200).json({ message: 'user on lab relation delete' })
  //         }
  //       } else {
  //         res.status(404).json({ message: 'user lab relation not found' })
  //       }
  //     } else {
  //       res.status(403).json({ message: 'admin access only' })
  //     }
  //   } else {
  //     res.status(412).json({ message: 'missing arguments' })
  //   }
  // }
}