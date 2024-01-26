class User {
  constructor ({ name = '', username = '', avatar = '', description = '' }) {
    Object.assign(this, { name, username, avatar, description })
  }

  static all () {
    return [
      {
        id: 1,
        name: 'thiago'
      },
      {
        id: 2,
        name: 'pedro'
      },
      {
        id: 3,
        name: 'martina'
      }
    ]
  }

  static getById (id) {
    // call persistence.js
  }

  save () {
    // call persistence.js
  }
}

export default User
