import serverless from 'serverless-http'

import { generateApp } from '../../services'
import router from './router'

export default serverless(generateApp(router))
