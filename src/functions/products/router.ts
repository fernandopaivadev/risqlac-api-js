import { generateRouter } from '../../services'
import controller from './controller'

export default generateRouter({
  controller,
  controllerName: 'product'
})
