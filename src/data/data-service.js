const DataService = {
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
  dataByRoom(knex, id) {
    return knex
      .from('room_data')
      .select('*')
      .where('room_id', id)
      .orderBy('date_added', 'asc')
      .orderBy('room_id', 'asc')
  },
  deleteData(knex, id) {
    return knex('room_data')
      .where({ id })
      .delete()
  },
  deleteRoom(knex, id) {
    return knex('rooms')
      .where('room_id', id)
      .delete()
  },
  getById(knex, id) {
    return knex.from('room_data').select('*').where('room_data_id', id).first()
  },
  deleteById(knex, id) {
    return knex.from('room_data').select('*').where('room_data_id', id).first().delete()
  },
}

module.exports = DataService