export const routes = (router) => {
  router.get('/', (req, res) => {
    res.json([
      {
        id: 1,
        name: 'thiago'
      },
      {
        id: 2,
        name: 'pedro'
      }
    ])
  })

  return router
}
