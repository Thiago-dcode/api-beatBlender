import app from './app.js'

export default function start (port = 3000) {
  app.listen(port, () => {
    console.log(`App listening on port http://localhost:${port}`)
  })
}
