const express = require('express')
const DataService = require('./data-service')
const { requireAuth } = require('../middleware/jwt-auth')

const dataRouter = express.Router()


  dataRouter
    .route('/:room_data_id')
    .all(requireAuth)
    .all((req, res, next) => {
      DataService
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
      DataService
    .deleteById(
      req.app.get('db'),
      req.params.room_data_id
    )
      .then(data => {
        res.data = data
        next() 
      })
      .catch(next)
    })

module.exports = dataRouter