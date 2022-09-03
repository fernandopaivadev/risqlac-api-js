import serverless from 'serverless-http'

import { createApp } from '../../services'
import router from './router'

export default serverless(createApp(router))
