const RoomDataService = {
  getAllData(knex) {
    return knex.select('*').from('room_data')
  },
  addData(knex, newData) {
    return knex 
      .insert(newData)
      .into('room_data')
      .returning('*')
      .then(rows => {
        return rows[0]
      })
  },
  getById(knex, id) {
    return knex.from('room_data').select('*').where('room_data_id', id).first()
  },
  deleteById(knex, id) {
    return knex.from('room_data').select('*').where('room_data_id', id).first().delete()
  },
}

module.exports = RoomDataService
