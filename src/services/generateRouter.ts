import { Router } from 'express'

import { Services } from '../@types'
import sendResponse from '../middleware/sendResponse'
import verifyToken from '../middleware/verifyToken'
import verifyUser from '../middleware/verifyUser'

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
  `/${
    controllerName.split(/(?=[A-Z])/).join('-').toLowerCase()
  }/${
    routeName.split(/(?=[A-Z])/).join('-').toLowerCase()
  }`

const generateRouter: Services.GenerateRouter = ({
  controller,
  controllerName
}) => {
  const router: { [key: string]: any } & Router = Router()

  Object.keys(controller).forEach(routeName => {
    const method = getHTTPMethod(routeName)
    const path = getPath(controllerName, routeName)
    const endpoint = controller[routeName]

    const loginNotRequired = [
      '/user/login',
      '/user/forgot-password',
      '/user/reset-password',
      '/message/create'
    ]

    if (method && path) {
      if (loginNotRequired.includes(path)) {
        router[method](
          path,
          endpoint,
          sendResponse
        )
      } else {
        if ([
          '/object-storage/create',
          '/archive/create'
        ].includes(path)) {
          router[method](
            path,
            verifyToken,
            verifyUser,
            endpoint,
            sendResponse
          )
        } else {
          router[method](
            path,
            verifyToken,
            verifyUser,
            endpoint,
            sendResponse
          )
        }
      }
    }
  })

  return router
}

export default generateRouter
