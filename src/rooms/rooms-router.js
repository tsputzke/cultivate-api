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
  
  // Get Room data/ Delete room, by room_id
  roomsRouter
    .route('/:room_id')
    .all(requireAuth)
    .all((req, res, next) => {
      RoomsService
    .dataByRoom(
      req.app.get('db'),
      req.params.room_id
    )
      .then(data => {
        res.data = data
        next() 
      })
      .catch(next)
    })
    .get((req, res, next) => {
      res.send(res.data)
      // res.json(serializeData(res.data))
    })

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


module.exports = roomsRouter