const RoomsService = {
  getAllRooms(knex) {
    return knex.select('*').from('rooms')
  },
  addRoom(db, newRoom) {
    return db 
      .insert(newRoom)
      .into('rooms')
  },
  dataByRoom(knex, id) {
    return knex
      .from('room_data')
      .select('*')
      .where('room_id', id)
      .orderBy('date_added', 'asc')
      .orderBy('room_id', 'asc')
  },
  deleteRoom(knex, id) {
    return knex('rooms')
      .where('room_id', id)
      .delete()
  },
}

module.exports = RoomsService

