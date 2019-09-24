const express = require('express')
const RoomDataService = require('./room_data-service')
const { requireAuth } = require('../middleware/jwt-auth')

const roomDataRouter = express.Router()
const jsonParser = express.json()

const serializeData = data => ({
  room_id: data.room_id,
  date_added: data.date_added,
  temperature: data.temperature,
  rh: data.rh,
  co2: data.co2,
  light: data.light,
  comments: data.comments
})

// Get room-data by room_id
roomDataRouter
    .route('/:room_id')
    .all(requireAuth)
    .all((req, res, next) => {
      RoomDataService
  
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

// Add room-data
roomDataRouter
  .route('/')
  .get((req, res, next) => {
    const knexInstance = req.app.get('db')
    RoomDataService
  .getAllData(knexInstance)
      .then(data => {
        res.json(data.map(serializeData))
      })
      .catch(next)
  })
  .post(requireAuth, jsonParser, (req, res, next) => {
    const { room_id, date_added, temperature, rh, co2, light, comments } = req.body;
    const newData = { room_id, date_added, temperature, rh, co2, light, comments };

    RoomDataService
      .addData(
        req.app.get('db'),
        newData
      )
        .then(room_data => (
          res 
            .status(201)
            .json(serializeData(room_data))
        ))
        .catch(next)
  })

  // Delete room-data
  roomDataRouter
    .route('/:room_data_id')
    .all(requireAuth)
    .all((req, res, next) => {
      RoomDataService

    .getById(
        req.app.get('db'),
        req.params.room_data_id
      )
        .then(data => {
          res.data = data
          next() 
        })
        .catch(next)
    })
    .get((req, res, next) => {
      res.send(res.data)
    })
    .delete((req, res, next) => {
      RoomDataService
    .deleteById(
      req.app.get('db'),
      req.params.room_data_id
    )
      .then(data => {
        res.status(204).end()
      })
      .catch(next)
    })

module.exports = roomDataRouter

