import start from './core/server.js'
import { env } from './utils/utils.js'

start(parseInt(env.get('PORT')))
