import express from 'express'

import cors from 'cors' // Make sure to import the 'cors' module

class AppController {
  constructor () {
    this.app = express() // Use the imported 'express' module directly
    this.middlewares()
    this.routes()
  }

  middlewares () {
    this.app.use(express.json())
    this.app.use(cors()) // Enable CORS middleware
    // this.app.use(bodyParser.json());
  }

  async routes () {
    const router = express.Router()
    const routes = (await import('../routes.js')).default
    for (const route in routes) {
      this.app.use(`/${route}`, routes[route](router))
    }
  }
}

export default new AppController().app // Create an instance of AppController and export its express instance
