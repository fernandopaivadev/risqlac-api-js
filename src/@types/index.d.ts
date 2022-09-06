import { Request, Response, Router, Express } from 'express'
import { Attachment } from 'nodemailer/lib/mailer'

import { user } from '@prisma/client'

interface DefaultResponse {
  status?: number
  data?: {
    [key: string]: any
  }
  err?: Error
}

interface CustomRequest extends Request {
  userId?: number
  token?: string
  user?: Omit<user, 'hashed_password'> | void | null
}

type CustomNextFunction = ({ status, data, err }?: DefaultResponse) => void

export namespace Middleware {
  export type VerifyToken = (
    req: CustomRequest,
    res: Response,
    next: NextFunction
  ) => void

  export type VerifyUser = (
    req: CustomRequest,
    res: Response,
    next: NextFunction
  ) => void

  export type LogRequest = (
    req: CustomRequest,
    res: Response,
    next: NextFunction
  ) => void

  export type SendResponse = (
    { status, data, err }: DefaultResponse,
    req: CustomRequest,
    res: Response,
    next: NextFunction
  ) => void
}

export namespace Functions {
  export namespace Controllers {
    type Endpoint = (
      req: CustomRequest,
      res: Response,
      next: CustomNextFunction
    ) => Promise<void>
    export interface Info {
      list: Endpoint
    }
    export interface Users {
      login: Endpoint
      logout: Endpoint
      forgotPassword: Endpoint
      resetPassword: Endpoint
      create: Endpoint
      list: Endpoint
      update: Endpoint
      delete: Endpoint
    }

    export interface Products {
      create: Endpoint
      list: Endpoint
      update: Endpoint
      delete: Endpoint
    }
  }
}

export namespace Services {
  export interface Log {
    error: (scope: string, err: Error) => void
    info: (scope: string, info: string | { [key: string]: any }) => void
  }

  export namespace SendEmail {
    type HandlebarsTemplate = 'resetPassword' | 'userCreate'

    interface MaintenanceData {
      guide: string
      date: string
      unit: {
        name: string
        address: string
      }
    }

    interface ResetPasswordData {
      token: string
    }

    interface UserCreateData {
      username: string
      email: string
      password: string
    }

    export type SendEmailFunction = ({
      from,
      to,
      subject,
      template,
      data,
      attachments
    }: {
      from: string
      to: string | string[]
      subject: string
      template: HandlebarsTemplate
      data: MaintenanceData | ResetPasswordData | UserCreateData
      attachments?: Attachment[]
    }) => Promise<void>
  }

  export type CreateRouter = ({
    controllerName,
    controller
  }: {
    controllerName: string
    controller: { [key: string]: Controllers.Endpoint }
  }) => Router

  export type CreateApp = (router: Router) => Express
}

export interface Config {
  DATABASE_URL: string

  JWT_SECRET: string
  JWT_EXP_TIME: number

  EMAIL_CONFIG_HOST: string
  EMAIL_CONFIG_PORT: number
  EMAIL_CONFIG_AUTH_USER: string
  EMAIL_CONFIG_AUTH_PASS: string
}
