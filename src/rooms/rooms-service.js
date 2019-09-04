const RoomsService = {
  getAllRooms(knex) {
    return knex.select('*').from('rooms')
  },
  addRoom(db, newRoom) {
    return db 
      .insert(newRoom)
      .into('rooms')
  },
  checkForRoom(knex, name) {
    return knex.from('rooms').select('*').where('user_name', name).first()
  },
  roomByUser(knex, id) {
    return knex.from('rooms').select('*').where('user_id', id)
  },
  deleteRoom(knex, id) {
    return knex('rooms')
      .where({ id })
      .delete()
  },
}

module.exports = RoomsService
