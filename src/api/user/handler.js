import UserRepository from './repository.js'
import { db } from '../../db/db.js'

const user = new UserRepository(await db())
class UserHandler {
  async index (req, res) {
    const all = await user.all()
    res.status(200).json(all)
  }

  async create (req, res) {
    const body = req.body

    const result = await user.new(body)

    res.send(result)
  }
}

export default (new UserHandler())
