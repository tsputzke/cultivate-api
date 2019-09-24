require('dotenv').config();
const knex = require('knex')
const app = require('../src/app')
const helpers = require('./test-helpers')
const jwt = require('jsonwebtoken')


describe('Room Data Endpoints', function() {
  let db

  const { testUsers, testRooms, testData } = helpers.makeRoomsFixtures()

  function makeAuthHeader(user, secret = process.env.JWT_SECRET) {
    const token = jwt.sign({ user_id: user.user_id }, secret, {
      subject: user.user_name,
      algorithm: 'HS256',
    })
    return `bearer ${token}`
  }

  before('make knex instance', () => {
    db = knex({
      client: 'pg',
      connection: process.env.TEST_DATABASE_URL,
    })
    app.set('db', db)
  })

  after('disconnect from db', () => db.destroy())

  before('cleanup', () => helpers.cleanTables(db))

  afterEach('cleanup', () => helpers.cleanTables(db))

  beforeEach('insert users', () => {
      return db.into('cultivate_users').insert(testUsers)
  })
  beforeEach('insert rooms', () => {
    return db.into('rooms').insert(testRooms)
  })
  beforeEach('insert room_data', () => {
    return db.into('room_data').insert(testData)
  })

  describe(`GET /api/room-data/:room_id`, () => {
    context(`Given no data`, () => {
      it(`responds with 200 and an empty list`, () => {
        return supertest(app)
          .get(`/api/room-data/4`)
          // .set('Authorization', makeAuthHeader(testUsers[3]))
          .expect(200, [])
      })
    });

    context('Given there are data in the room', () => {
        it('GET /data for room 1, responds with 200', () => {
          return supertest(app)
            .get(`/api/room-data/1`)
            // .set('Authorization', makeAuthHeader(testUsers[3]))
            .expect(200, [testData[0]])
        })
      })
  });

  describe('POST /api/room-data', () => {
    context('Given there are data in the database', () => {
      beforeEach('insert data', () => {
          return db
              .into('room_data')
              .set('Authorization', makeAuthHeader(testUsers[0]))
              .insert(testData)
      })
    })

    it(`responds with 401 'Missing bearer token when no basic token`, () => {
      const newData = 
      {
        room_id: 1,
        date_added: '2019-10-01',
        temperature: 30,
        rh: 85,
        co2: 500,
        light: 99,
        comments: 'Insert comment here!',
      };
      return supertest(app)
        .post(`/api/room-data`)
        .send(newData)
        .expect(401, { error: `Missing bearer token` })
      } 
    )

    it(`responds 401 'Unauthorized request' when no credentials in token`, () => {
       const userNoCreds = { user_name: '', password: '' }
         return supertest(app)
          .post(`/api/room-data`)
          .set('Authorization', makeAuthHeader(userNoCreds))
          .expect(401, { error: `Unauthorized request` })
    })

    it(`responds 401 'Unauthorized request' when invalid user`, () => {
      const userInvalidCreds = { user_name: 'user-not', password: 'existy' }
      return supertest(app)
        .post(`/api/room-data`)
        .set('Authorization', makeAuthHeader(userInvalidCreds))
        .expect(401, { error: `Unauthorized request` })
    })

    it('creates data, responding with 201 and new data', () => {
      const newData = 
        {
          room_id: 1,
          date_added: '2019-10-01',
          temperature: 30,
          rh: 85,
          co2: 500,
          light: 99,
          comments: 'Insert comment here!',
        }
      return supertest(app)
        .post('/api/room-data')
        .send(newData)
        .set('Authorization', makeAuthHeader(testUsers[0]))
        .expect(201)
  })
})

  describe('DELETE /api/room-data/:room_data_id', () => { 
    context('Given there are data in the database', () => {

      it('responds with 204 and removes the room-data', () => {
        const roomDataToDelete = 1;
        const expectedData = testData.filter(
          roomData => roomData.room_data_id !== roomDataToDelete
        );
        return supertest(app)
          .delete(`/api/room-data/${roomDataToDelete}`)
          .expect(204)
          // .set('Authorization', makeAuthHeader(testUsers[0]))
          .then(res =>
            supertest(app)
              .get('/api/room-data')
              .expect(expectedData)
            )
      })
    })
  })
})