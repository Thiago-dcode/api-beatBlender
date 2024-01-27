// should interact with db

export default class UserRepository {
  constructor (db) {
    this.db = db
  }

  async all (options = {}) {
    const users = await this.db.user.findMany(options)
    return users
  }

  async new (userForm) {
    const user = await this.db.user.create({
      data: userForm
    })
    return user
  }

  getById (id) {
    // call persistence.js
  }
}
