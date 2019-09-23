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
  console.log(makeAuthHeader(testUsers[3]))
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

  describe(`GET /api/users/:user_id`, () => {
    context(`Given no rooms`, () => {
      it(`responds with 200 and an empty list`, () => {
        return supertest(app)
          .get(`/api/users/4`)
          .set('Authorization', makeAuthHeader(testUsers[3]))
          .expect(200, [])
      })
    });

    // context('Given there are rooms in the database', () => {
    //     it('GET /reviews responds with 200 and the rooms for user 4', () => {
    //       return supertest(app)
    //         .get(`/api/users/4`)
    //         .set('Authorization', makeAuthHeader(testUsers[3]))
    //         .expect(200, testRooms)
    //     })
    //   })
  });

  // describe('GET /reviews/:reviewId responds with 200 and all the reviews', () => {
  //   context('Given no reviews', () => {
  //     it('responds with 404 not found', () => {
  //       const reviewId = 123456;
  //       return supertest(app)
  //         .get(`/reviews/${reviewId}`)
  //         .set('Authorization', makeAuthHeader(testUsers[0]))
  //         .expect(404, {error: {message: `Review doesn't exist`} })
  //     })
  //   })

  //   context('Given there are reviews in the database', () => {
  //     const testReview = [
  //       {
  //         id: 1,
  //         bev_type: 'test type',
  //         bev_name:'test name',
  //         user_review: 'First test review!',
  //         rating: 2,
  //         bev_id: 'apothicdark20124',
  //         user_id: 1,
  //         date_created: '2029-01-22T16:28:32.615Z',
  //       }
  //     ];

  //     beforeEach('insert review', () => {
  //       return db.into('sip_rate_reviews').insert(testReview)
  //     })

  //     it('responds with 200 and the specified review', () => {
  //       const reviewId = 1;
  //       const expectedReview = testReview[reviewId -1];
  //       return supertest(app)
  //         .get(`/reviews/${reviewId}`)
  //         .set('Authorization', makeAuthHeader(testUsers[0]))
  //         .expect(200, expectedReview)
  //     })
  //   })
  // })




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

  //   it('creates room, responding with 201 and new room', () => {
  //     const newRoom = 
  //       {
  //         user_id: 1,
  //         room_name: 'test-room-5',
  //         room_description: 'Lorem ipsum dolor sit amet'
  //       }
  //     return supertest(app)
  //       .post('/api/rooms')
  //       .send(newRoom)
  //       .set('Authorization', makeAuthHeader(testUsers[0]))
  //       .expect(201)
  //       .expect(res => {
  //         expect(res.body.user_id).to.eql(newData.user_id)
  //         expect(res.body.room_name).to.eql(newData.room_name)
  //         expect(res.body.room_description).to.eql(newData.room_description)
  //         expect(res.body).to.have.property('room_id')
  //       })
  //       .expect(res =>
  //         db
  //           .from('rooms')
  //           .select('*')
  //           .where({ room_id: res.body. room_id })
  //           .first()
  //           .then(row => {
  //             expect(res.body.user_id).to.eql(newData.user_id)
  //             expect(res.body.room_name).to.eql(newData.room_name)
  //             expect(res.body.room_description).to.eql(newData.room_description)
  //           })
  //     )
  // })
})

  // describe('DELETE /api/rooms', () => { 
  //   context('Given no rooms', () => {
  //     it('responds with 404 not found', () => {
  //       const roomId = 123456;
  //       return supertest(app)
  //         .delete(`/api/rooms/${roomId}`)
  //         .set('Authorization', makeAuthHeader(testUsers[0]))
  //         .expect(404, { error: { message: `Room doesn't exist`} })
  //     })
  //   })
  //   context('Given there are rooms in the database', () => {

  //     beforeEach('insert room', () => {
  //       return db.into('rooms').insert(testRooms)
  //     })

  //     it('responds with 204 and removes the room', () => {
  //       const roomToDelete = 1;
  //       const exectedRooms = rooms.filter(
  //         room => room.room_id !== roomToDelete
  //       );
  //       return supertest(app)
  //         .delete(`/api/rooms/${roomToDelete}`)
  //         .expect(204)
  //         .set('Authorization', makeAuthHeader(testUsers[0]))
  //         .then(res =>
  //           supertest(app)
  //             .get('/api/rooms')
  //             .expect(exectedRooms)
  //           )
  //     })
  //   })
  // })
}) 