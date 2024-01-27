import start from './core/server.js'
import { env } from './utils/utils.js'
start(env.get('PORT'))
