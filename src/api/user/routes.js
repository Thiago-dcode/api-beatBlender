import handler from './handler.js'
export const routes = (router) => {
  router.get('/users', handler.index)

  return router
}
