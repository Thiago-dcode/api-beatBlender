import handler from './handler.js'
export const routes = (router) => {
  router.get('/users', handler.index)
  router.post('/users', handler.create)
  return router
}
