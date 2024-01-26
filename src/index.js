import start from './core/server.js'
import { config } from 'dotenv'
config()

start(process.env.PORT)
