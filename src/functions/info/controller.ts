import packageJson from '../../../package.json'
import { Functions } from '../../@types'

export default {
  list: async (req, res, next) => {
    const { name, version, author, description } = packageJson

    next({
      status: 200,
      data: {
        name,
        version,
        author,
        description
      }
    })
  }
} as Functions.Controllers.Info
