import { Services } from '../@types'

export default {
  error: (scope, err) => {
    console.log(
      `\nERROR > ${scope}: ${
        typeof err.message === 'object'
          ? JSON.stringify(err.message, null, 2)
          : err.message
      }\n`
    )
  },
  info: (scope, info) => {
    console.log(
      `\nINFO > ${scope}: ${
        typeof info === 'object' ? JSON.stringify(info, null, 2) : info
      }\n`
    )
  }
} as Services.Log
