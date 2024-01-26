import app from './app.js'

export default function start (port) {
  app.listen(port, () => {
    console.log('App listening on port 3000')
  })
}
