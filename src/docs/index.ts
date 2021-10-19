import { SwaggerUiOptions } from 'swagger-ui-express'

import { version, description } from '../../package.json'
import user from './controllers/user.docs'

const controllers: {[key: string]: {
    [key: string]: any
}} = {
  user
}

const docs: {
    [key: string]: {
        [key: string]: {
            [key: string]: string[]
        }
    }
} = {}

const authNotRequired = [
  '/user/auth',
  '/user/refresh-token',
  '/user/forgot-password',
  '/user/reset-password'
]

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

    if (!docs[path]) {
      docs[path] = {}

      if (!docs[path][method]) {
        docs[path][method] = {}

        if (!docs[path][method]['tags']) {
          docs[path][method]['tags'] = []
        }
      }
    }

    if (method && path && controller) {
      if (controllers[controllerName]) {
        docs[path][method] = authNotRequired.includes(path) ? {
          tags: [controllerName.split(/(?=[A-Z])/).join(' ').toUpperCase()],
          ...controllers[controllerName][routeName]
        } : {
          tags: [controllerName.split(/(?=[A-Z])/).join(' ').toUpperCase()],
          security: [{
            bearerAuth: []
          }],
          ...controllers[controllerName][routeName]
        }
      }
    }
  })
})

const swaggerFile = {
  openapi: '3.0.0',
  info: {
    title: 'RisqLAB API',
    description,
    version,
    contact: {
      email: 'fernandopaivaec@gmail.com'
    }
  },
  paths: {
    ...docs
  },
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT'
      }
    }
  }
}

const swaggerConfig: SwaggerUiOptions = {
  customSiteTitle: 'RisqLAB API'
}

export {
  swaggerConfig,
  swaggerFile
}
