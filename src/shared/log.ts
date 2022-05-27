import { stderr, stdout } from 'process'

import { Shared } from '@types'

export default {
  error: (scope, err) => {
    stderr.write(`\nERROR > ${scope} > ${
      typeof err.message === 'object' ?
        JSON.stringify(err, null, 2)
        :
        err.message
    }\n`)
  },
  info: (info) => {
    stdout.write(`\nINFO > ${info}\n`)
  }
} as Shared.Log
