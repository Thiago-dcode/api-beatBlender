import start from './core/server.js'
import { env } from './utils/utils.js'

process.on('warning', e => console.warn("WARNING!",e.stack));
start(parseInt(env.get('PORT')))
