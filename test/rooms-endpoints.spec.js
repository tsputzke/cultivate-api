require('dotenv').config();
const knex = require('knex')
const app = require('../src/app')
const helpers = require('./test-helpers')
const jwt = require('jsonwebtoken')


describe('Room Endpoints', function() {
  let db

  const { testUsers, testRooms } = helpers.makeRoomsFixtures()

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

  describe(`GET /api/rooms/:user_id`, () => {
    context(`Given no rooms`, () => {
      it(`responds with 200 and an empty list`, () => {
        return supertest(app)
          .get(`/api/rooms/4`)
          .set('Authorization', makeAuthHeader(testUsers[3]))
          .expect(200, [])
      })
    });

    context('Given there are rooms in the database', () => {
        it('GET /rooms for user 3, responds with 200', () => {
          return supertest(app)
            .get(`/api/rooms/1`)
            .set('Authorization', makeAuthHeader(testUsers[3]))
            .expect(200, [testRooms[0]])
        })
      })
  });

  describe('POST /api/rooms', () => {
    context('Given there are rooms in the database', () => {
      beforeEach('insert room', () => {
          return db
              .into('rooms')
              .set('Authorization', makeAuthHeader(testUsers[0]))
              .insert(testRooms)
      })
    })

    it(`responds with 401 'Missing bearer token when no basic token`, () => {
      const newRoom = 
      {
        user_id: 1,
        room_name: 'test-room-5',
        room_description: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Natus consequuntur deserunt commodi, nobis qui inventore corrupti iusto aliquid debitis unde non.Adipisci, pariatur.Molestiae, libero esse hic adipisci autem neque ?'
      };
      return supertest(app)
        .post(`/api/rooms`)
        .send(newRoom)
        .expect(401, { error: `Missing bearer token` })
      } 
    )

    it(`responds 401 'Unauthorized request' when no credentials in token`, () => {
       const userNoCreds = { user_name: '', password: '' }
         return supertest(app)
          .post(`/api/rooms`)
          .set('Authorization', makeAuthHeader(userNoCreds))
          .expect(401, { error: `Unauthorized request` })
    })

    it(`responds 401 'Unauthorized request' when invalid user`, () => {
      const userInvalidCreds = { user_name: 'user-not', password: 'existy' }
      return supertest(app)
        .post(`/api/rooms`)
        .set('Authorization', makeAuthHeader(userInvalidCreds))
        .expect(401, { error: `Unauthorized request` })
    })

    it('creates room, responding with 201 and new room', () => {
      const newRoom = 
        {
          user_id: 1,
          room_name: 'test-room-5',
          room_description: 'Lorem ipsum dolor sit amet'
        }
      return supertest(app)
        .post('/api/rooms')
        .send(newRoom)
        .set('Authorization', makeAuthHeader(testUsers[0]))
        .expect(201)
  })
})

  describe('DELETE /api/rooms', () => { 
    context('Given there are rooms in the database', () => {

      it('responds with 204 and removes the room', () => {
        const roomToDelete = 1;
        const exectedRooms = testRooms.filter(
          room => room.room_id !== roomToDelete
        );
        return supertest(app)
          .delete(`/api/rooms/delete/${roomToDelete}`)
          .expect(204)
          .set('Authorization', makeAuthHeader(testUsers[0]))
          .then(res =>
            supertest(app)
              .get('/api/rooms')
              .expect(exectedRooms)
            )
      })
    })
  })
}) 