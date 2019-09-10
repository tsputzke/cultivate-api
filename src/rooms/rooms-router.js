const express = require('express')
const RoomsService = require('./rooms-service')
const path = require('path')

const roomsRouter = express.Router()
const jsonParser = express.json()

const serializeRoom = room => ({
  room_id: room.room_id,
  user_id: room.user_id,
  room_name: room.room_name,
  room_description: room.room_description,
})

// Routes (get/post) for getting all users, posting new user
roomsRouter
  .route('/')
  .get((req, res, next) => {
    const knexInstance = req.app.get('db')
    RoomsService
  .getAllRooms(knexInstance)
      .then(rooms => {
        res.json(rooms.map(serializeRoom))
      })
      .catch(next)
  })
  .post(jsonParser, (req, res, next) => {
    const { room_name, room_description } = req.body;
    const newRoom = { room_name, room_description };
      
    RoomsService
      .addRoom(
        req.app.get('db'),
        newRoom
      )
        .then(room => (
          res 
            .status(201)
            .location(path.posix.join(req.originalUrl, `/${room.room_id}`))
            .json(serializeRoom(room))
        ))
        .catch(next)
  })

  // SHOULD THIS BE PART OF '/' ROUTE, ABOVE??
  // Responds to client with all rooms belonging to a user, based on their user_id
  roomsRouter
    .route('/:user_id')
    .all((req, res, next) => {
      RoomsService
    .roomByUser(
        req.app.get('db'),
        req.params.user_id
      )
        .then(rooms => {
          res.rooms = rooms
          next() 
        })
        .catch(next)
    })
    .get((req, res) => {
      res.json(res.rooms)
    })

module.exports = roomsRouter