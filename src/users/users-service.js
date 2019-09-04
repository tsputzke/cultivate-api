const UsersService = {
  getAllUsers(knex) {
    return knex.select('*').from('cultivate_users')
  },
  addUser(db, newUser) {
    return db 
      .insert(newUser)
      .into('cultivate_users')
  },
  checkForUser(knex, name) {
    return knex.from('cultivate_users').select('*').where('user_name', name).first()
  },
}

module.exports = UsersService
