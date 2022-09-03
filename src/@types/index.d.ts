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
  userId?: string
  token?: string
  user?: Omit<user, 'hashed_password'> | void | null
}

type CustomNextFunction = ({ status, data, err }?: DefaultResponse) => void

export namespace Middleware {
  export type VerifyUser = (
    req: CustomRequest,
    res: Response,
    next: NextFunction
  ) => void
  export type VerifyToken = (
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

    export interface Users {
      login: Endpoint
      logout: Endpoint
      forgotPassword: Endpoint
      resetPassword: Endpoint
      create: Endpoint
      list: Endpoint
      data: Endpoint
      update: Endpoint
      delete: Endpoint
    }

    export interface Products {
      create: Endpoint
      list: Endpoint
      data: Endpoint
      update: Endpoint
      delete: Endpoint
    }
  }
}

export namespace Services {
  type GenerateReport = ({
    type,
    data
  }: GenerateReport.Params) => Promise<void | Buffer | null>

  export type GetUTC = (
    timezone: string | undefined | null,
    date: Date
  ) => string | undefined

  type scope = 'DATABASE' | 'CONTROLLER' | 'EMAIL_SHIPPING'

  export interface Log {
    error: (scope: scope, err: Error) => void
    info: (info: string) => void
  }

  namespace SendEmail {
    type HandlebarsTemplate =
      | 'maintenanceCreate'
      | 'maintenanceUpdate'
      | 'correctiveMaintenance'
      | 'preventiveMaintenance'
      | 'resetPassword'
      | 'maintenanceReport'

    interface MaintenanceData {
      guide: string
      date: string
      unit: {
        name: string
        address: string
      }
    }

    interface ResetPasswordData {
      resetPasswordLink: string
    }

    interface Params {
      from: string
      to: string | string[]
      subject: string
      template: HandlebarsTemplate
      data: MaintenanceData | ResetPasswordData
      attachments?: Attachment[]
    }

    export type SendEmailFunction = ({
      from,
      to,
      subject,
      template,
      data,
      attachments
    }: SendEmail.Params) => Promise<void>
  }

  interface GenerateRouterParams {
    controllerName: string
    controller: { [key: string]: Controllers.Endpoint }
  }

  export type CreateRouter = ({
    controllerName,
    controller
  }: GenerateRouterParams) => Router

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
