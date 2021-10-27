import { Router, Response } from 'express'

import { CustomRequest } from '@types'

import product from './controllers/product'
import user from './controllers/user'
import verifyToken from './middleware/verifyToken'
import verifyUser from './middleware/verifyUser'

const controllers: { [key: string]: {
    [key: string]: (req: CustomRequest, res: Response) => Promise<void>
}} = {
  user,
  product
}

const authNotRequired = [
  '/user/auth',
  '/user/create',
  '/user/refresh-token',
  '/user/forgot-password',
  '/user/reset-password'
]

const routes: { [key: string]: any } & Router = Router()

Object.keys(controllers).forEach((controllerName: string) => {
  Object.keys(controllers[controllerName]).forEach(routeName => {
    const getHTTPMethod = (routeName: string): string => {
      switch (routeName) {
      case 'create':
        return 'post'
      case 'update':
        return 'put'
      case 'delete':
        return 'delete'
      case 'resetPassword':
        return 'patch'
      case 'firstUser':
        return 'post'
      case 'generate':
        return 'post'
      default:
        return 'get'
      }
    }

    const getPath = (controllerName: string, routeName: string): string =>
      `/${
        controllerName.split(/(?=[A-Z])/).join('-').toLowerCase()
      }/${
        routeName.split(/(?=[A-Z])/).join('-').toLowerCase()
      }`

    const method = getHTTPMethod(routeName)
    const path = getPath(controllerName, routeName)
    const controller = controllers[controllerName][routeName]

    if (method && path && controller) {
      if (authNotRequired.includes(path)) {
        routes[method](
          path,
          controller
        )
      } else {
        routes[method](
          path,
          verifyToken,
          verifyUser,
          controller
        )

      }
    }
  })
})

export {
  routes
}
