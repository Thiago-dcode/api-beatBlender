import { config } from 'dotenv'
config()
export const env = {
  get: (key) => {
    return process.env[key]
  }
}
