const RoomsService = {
  getAllRooms(knex) {
    return knex.select('*').from('rooms')
  },
  addRoom(db, newRoom) {
    return db 
      .insert(newRoom)
      .into('rooms')
  },
  deleteRoom(knex, id) {
    return knex('rooms')
      .where('room_id', id)
      .delete()
  },
  roomsByUser(knex, id) {
    return knex.from('rooms').select('*').where('user_id', id)
  },
}

module.exports = RoomsService
