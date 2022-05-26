import { Request, Response } from 'express'

export namespace App {
  interface DefaultResponse {
    status?: number
    data?: {
      [key: string]: any
    }
    err?: Error
  }

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
    } | void | null
  }

  type CustomNextFunction = ({ status, data, err }?: DefaultResponse) => void

  namespace Middleware {
    type VerifyUser = (req: CustomRequest, res: Response, next: NextFunction) => void
    type VerifyToken = (req: CustomRequest, res: Response, next: NextFunction) => void
    type SendResponse = ({ status, data, err }: DefaultResponse, req: CustomRequest, res: Response, next: NextFunction) => void
  }

  namespace Controllers {
    type Endpoint = (req: CustomRequest, res: Response, next: CustomNextFunction) => Promise<void>

    interface Users {
      login: Endpoint
      forgotPassword: Endpoint
      resetPassword: Endpoint
      create: Endpoint
      list: Endpoint
      data: Endpoint
      update: Endpoint
      delete: Endpoint
    }

    interface Products {
      create: Endpoint
      list: Endpoint
      data: Endpoint
      update: Endpoint
      delete: Endpoint
    }
  }
}

export namespace Shared {
  type scope =
    'HTTP_SERVER' |
    'DATABASE' |
    'REDIS' |
    'MQTT' |
    'CALC_ENERGY' |
    'CALC_DAY_ENERGY' |
    'CALC_MONTH_ENERGY' |
    'CALC_YEAR_ENERGY' |
    'CLEAN_OBJECT_STORAGE' |
    'CONTROLLER' |
    'WEBSOCKET' |
    'EMAIL_SHIPPING' |
    'GENERATE_REPORT'

  interface Log {
    error: (scope: scope, err: Error) => void
    info: (info: string) => void
  }

  namespace SendEmail {
    type HandlebarsTemplate = 'resetPassword'

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
      from: string,
      to: string | string[],
      subject: string,
      template: HandlebarsTemplate
      data: MaintenanceData | ResetPasswordData
      attachments?: Attachment[]
    }

    type SendEmailFunction = ({
      from, to, subject, template, data, attachments
    }: SendEmail.Params) => Promise<void>
  }
}
