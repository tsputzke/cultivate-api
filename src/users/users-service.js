const UsersService = {
  addUser(db, newUser) {
    return db 
      .insert(newUser)
      .into('cultivate_users')
  },
}

module.exports = UsersService