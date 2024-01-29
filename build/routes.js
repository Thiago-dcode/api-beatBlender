import { Router } from 'express'
import userRoutes from './api/user/routes.js'
import keyRoutes from './api/key/routes.js'
const homeRouter = Router()
homeRouter.get('/', (req, res) => {
  res.send('HELLO FROM HOME PAGE')
})
const routes = {
  '/': homeRouter,
  users: userRoutes(),
  keys: keyRoutes
}
export default routes
