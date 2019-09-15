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

roomDataRouter
  .route('/')
  .all(requireAuth)
  .get((req, res, next) => {
    res.send('RoomDataRouter')
  })
  .post(jsonParser, (req, res, next) => {
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
    .delete((req, res, next) => {
      RoomDataService
    .deleteRoom(
      req.app.get('db'),
      req.params.room_id
    )
      .then(numRowsAffected => {
        res.status(204).end()
      })
      .catch(next)
    })

  // roomDataRouter
  //   .route('/data/:room_data_id')
  //   .all(requireAuth)
  //   .all((req, res, next) => {
  //     RoomDataService
  //   .getById(
  //       req.app.get('db'),
  //       req.params.room_data_id
  //     )
  //       .then(data => {
  //         res.data = data
  //         next() 
  //       })
  //       .catch(next)
  //   })
  //   .get((req, res, next) => {
  //     res.send(res.data)
  //   })
  //   .delete((req, res, next) => {
  //     RoomDataService
  //   .deleteById(
  //     req.app.get('db'),
  //     req.params.room_data_id
  //   )
  //     .then(data => {
  //       res.data = data
  //       next() 
  //     })
  //     .catch(next)
  //   })

module.exports = roomDataRouter
