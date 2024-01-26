import User from './user.js'

class UserHandler {
  index (req, res) {
    res.json(User.all())
  }

  create (req, res) {
    // validate req.body
    const user = new User()
  }
}

export default (new UserHandler())
