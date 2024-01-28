import { config } from "dotenv"
config()
export const env = {
  get: (key:string) :any=> {
    return process.env[key]
  }
}
