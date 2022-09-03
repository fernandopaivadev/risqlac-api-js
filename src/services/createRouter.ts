import { Router } from 'express'

import { Services } from '../@types'
import {
  verifyToken,
  verifyUser,
  logRequest,
  sendResponse
} from '../middleware'

const getHTTPMethod = (routeName: string): string => {
  switch (routeName) {
    case 'logout':
      return 'delete'
    case 'create':
      return 'post'
    case 'update':
      return 'put'
    case 'delete':
      return 'delete'
    case 'resetPassword':
      return 'patch'
    default:
      return 'get'
  }
}

const getPath = (controllerName: string, routeName: string): string =>
  `/${controllerName
    .split(/(?=[A-Z])/)
    .join('-')
    .toLowerCase()}/${routeName
    .split(/(?=[A-Z])/)
    .join('-')
    .toLowerCase()}`

const createRouter: Services.CreateRouter = ({
  controller,
  controllerName
}) => {
  const router: { [key: string]: any } & Router = Router()

  Object.keys(controller).forEach(routeName => {
    const method = getHTTPMethod(routeName)
    const path = getPath(controllerName, routeName)
    const endpoint = controller[routeName]

    const loginNotRequired = [
      '/info/list',
      '/user/login',
      '/user/forgot-password',
      '/user/reset-password'
    ]

    if (method && path) {
      if (loginNotRequired.includes(path)) {
        router[method](path, logRequest, endpoint, sendResponse)
      } else {
        router[method](
          path,
          verifyToken,
          verifyUser,
          logRequest,
          endpoint,
          sendResponse
        )
      }
    }
  })

  return router
}

export default createRouter
