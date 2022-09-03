import { createRouter } from '../../services'
import controller from './controller'

export default createRouter({
  controller,
  controllerName: 'user'
})
