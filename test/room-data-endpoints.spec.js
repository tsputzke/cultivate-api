require('dotenv').config();
const knex = require('knex')
const app = require('../src/app')
const helpers = require('./test-helpers')
const jwt = require('jsonwebtoken')


describe('Room Data Endpoints', function() {
  let db

  const { testUsers, testRooms, testRoomData } = helpers.makeRoomsFixtures()

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
      connection: process.env.TEST_DB_URL,
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
    return db.into('room_data').insert(testRoomData)
  })

  describe('POST /room-data', () => {
    context('Given there are room data in the database', () => {
      beforeEach('insert room-data', () => {
          return db
              .into('room-data')
              .set('Authorization', makeAuthHeader(testUsers[0]))
              .insert(testRoomData)
      })
    })

    it(`responds with 401 'Missing bearer token when no basic token`, () => {
      const newData = 
      {
        room_data_id: 1,
        room_id: 1,
        date_added: '2019-09-01',
        temperature: 25,
        rh: 75,
        co2: 400,
        light: 100,
        comments: 'First test comment!',
      };
      return supertest(app)
        .post(`/room-data`)
        .send(newData)
        .expect(401, { error: `Missing bearer token` })
      } 
    )

    it(`responds 401 'Unauthorized request' when no credentials in token`, () => {
       const userNoCreds = { user_name: '', password: '' }
         return supertest(app)
          .post(`/room-data`)
          .set('Authorization', makeAuthHeader(userNoCreds))
          .expect(401, { error: `Unauthorized request` })
    })

    it(`responds 401 'Unauthorized request' when invalid user`, () => {
      const userInvalidCreds = { user_name: 'user-not', password: 'existy' }
      return supertest(app)
        .post(`/room-data`)
        .set('Authorization', makeAuthHeader(userInvalidCreds))
        .expect(401, { error: `Unauthorized request` })
    })

    it('creates data, responding with 201 and new data', () => {
      const testUser = testUsers[0]
      const newData = 
        {
          room_data_id: 1,
          room_id: 1,
          date_added: '2019-09-01',
          temperature: 25,
          rh: 75,
          co2: 400,
          light: 100,
          comments: 'First test comment!',
        }
      return supertest(app)
        .post('/room-data')
        .send(newData)
        .set('Authorization', makeAuthHeader(testUsers[0]))
        .expect(201)
        .expect(res => {
          expect(res.body.room_id).to.eql(newData.room_id)
          expect(res.body.temperature).to.eql(newData.temperature)
          expect(res.body.rh).to.eql(newData.rh)
          expect(res.body.co2).to.eql(newData.co2)
          expect(res.body.light).to.eql(newData.light)
          expect(res.body.comments).to.eql(newData.comments)
          expect(res.body).to.have.property('room_data_id')
          expect(res.headers.location).to.eql(`/room-data/${res.body.id}`)
        })
        .expect(res =>
          db
            .from('room_data')
            .select('*')
            .where({ room_data_id: res.body. room_data_id })
            .first()
            .then(row => {
              expect(res.body.room_id).to.eql(newData.room_id)
              expect(res.body.temperature).to.eql(newData.temperature)
              expect(res.body.rh).to.eql(newData.rh)
              expect(res.body.co2).to.eql(newData.co2)
              expect(res.body.light).to.eql(newData.light)
              expect(res.body.comments).to.eql(newData.comments)
              const expectedDate = new Date().toLocaleString('en', { timeZone: 'UTC' })
              const actualDate = new Date(row.date_added).toLocaleString()
              expect(actualDate).to.eql(expectedDate)
            })
      )
  })
})

  // describe('DELETE /reviews/:reviewId', () => { 
  //   context('Given no reviews', () => {
  //     it('responds with 404 not found', () => {
  //       const reviewId = 123456;
  //       return supertest(app)
  //         .delete(`/reviews/${reviewId}`)
  //         .set('Authorization', makeAuthHeader(testUsers[0]))
  //         .expect(404, { error: { message: `Review doesn't exist`} })
  //     })
  //   })
  //   context('Given there are reviews in the database', () => {
  //     const testReviews = helpers.makeReviewsArray()

  //     beforeEach('insert reviews', () => {
  //       return db.into('sip_rate_reviews').insert(testReviews)
  //     })

  //     it('responds with 204 and removes the review', () => {
  //       const reviewToDelete = 1;
  //       const expectedReviews = testReviews.filter(
  //         review => review.id !== reviewToDelete
  //       );
  //       return supertest(app)
  //         .delete(`/reviews/${reviewToDelete}`)
  //         .expect(204)
  //         .set('Authorization', makeAuthHeader(testUsers[0]))
  //         .then(res =>
  //           supertest(app)
  //             .get('/reviews')
  //             .expect(expectedReviews)
  //           )
  //     })
  //   })
  // })
})