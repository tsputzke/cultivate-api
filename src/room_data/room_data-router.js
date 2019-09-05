const express = require('express')
const xss = require('xss')
const RoomDataService = require('./room_data-service')
const path = require('path')

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
    // .post(jsonParser, (req, res, next) => {
    //   const { user_name, password } = req.body;
    //   const checkUser = { user_name, password };
        
    //   console.log(checkUser)
      
    //   res.send(checkUser)    
    // })

module.exports = roomDataRouter
