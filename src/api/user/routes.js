import handler from './handler.js'
export const routes = (router) => {
  router.get('/user', handler.index)

  return router
}
