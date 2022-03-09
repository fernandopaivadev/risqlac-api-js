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
    labs: users_on_labs[],
    created_at: Date,
    updated_at: Date
  } | undefined
}

export {
  CustomRequest
}
