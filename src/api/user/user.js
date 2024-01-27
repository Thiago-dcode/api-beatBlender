class User {
  constructor ({ name = '', username = '', avatar = '', description = '' }) {
    Object.assign(this, { name, username, avatar, description })
  }

  static async all (db) {

  }
}

export default User
