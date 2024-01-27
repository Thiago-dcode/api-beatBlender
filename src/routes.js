import { routes as userRoutes } from './api/user/routes.js'

export default {
  '/': (router) => {
    router.get('', (req, res) => {
      res.send('<h1>Hello from BeatBlender</h1>')
    })
    return router
  },
  users: (router) => {
    return userRoutes(router)
  }

}
