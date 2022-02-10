import { Request } from 'express'

import { lab, users_on_labs } from '@prisma/client'

interface CustomRequest extends Request {
  userId: string
  user: {
    id: string,
    is_admin: boolean,
    email: string,
    username: string,
    phone: string,
    created_at: Date,
    updated_at: Date
  } | undefined
  labs: lab[] | undefined
  usersOnLabs: users_on_labs[] | undefined
}

export {
  CustomRequest
}
