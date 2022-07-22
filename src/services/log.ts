import { Services } from '../@types'

export default {
  error: (scope, err) => {
    console.log(`\nERROR > ${scope} > ${
      typeof err.message === 'object' ?
        JSON.stringify(err, null, 2)
        :
        err.message
    }\n`)
  },
  info: (info) => {
    console.log(`\nINFO > ${info}\n`)
  }
} as Services.Log
