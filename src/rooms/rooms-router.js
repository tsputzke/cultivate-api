const express = require('express')
const RoomsService = require('./rooms-service')
const path = require('path')
const { requireAuth } = require('../middleware/jwt-auth')

const roomsRouter = express.Router()
const jsonParser = express.json()

const serializeRoom = room => ({
  room_id: room.room_id,
  user_id: room.user_id,
  room_name: room.room_name,
  room_description: room.room_description,
})

// Add room
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
  .post(requireAuth, jsonParser, (req, res, next) => {
    const { room_name, room_description } = req.body;
    const newRoom = { room_name, room_description };

    for (const [key, value] of Object.entries(newRoom)) {
      if (value == null) {
        return res.status(400).json({
          error: `Missing '${key}' in request body`
        })
      }
    }

    newRoom.user_id = req.body.user_id
      
    RoomsService
      .addRoom(
        req.app.get('db'),
        newRoom
      )
        .then(room => (
          res 
            .status(201)
            // .location(path.posix.join(req.originalUrl, `/${room.room_id}`))
            .json(serializeRoom(room))
        ))
        .catch(next)
  })
  
  // Delete room by room_id
  roomsRouter
    .route('/delete/:room_id')
    .all(requireAuth)
    .delete((req, res, next) => {
      RoomsService
    .deleteRoom(
      req.app.get('db'),
      req.params.room_id
    )
      .then(numRowsAffected => {
        res.status(204).end()
      })
      .catch(next)
    })


  // Get all rooms belonging to a user, by user_id
  roomsRouter
  .route('/:user_id')
  .all(requireAuth)
  .all((req, res, next) => {
    RoomsService
  .roomsByUser(
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