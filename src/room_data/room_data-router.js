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

//     FoldersService
//   .insertFolder(
//       req.app.get('db'),
//       newfolder
//     )
//       .then(folder => {
//         res
//           .status(201)
//           .location(path.posix.join(req.originalUrl, `/${folder.id}`))
//           .json(serializeFolder(folder))
//       })
//       .catch(next)
//   })

// foldersRouter
//   .route('/:folder_id')
//   .all((req, res, next) => {
//     FoldersService
//   .getById(
//       req.app.get('db'),
//       req.params.folder_id
//     )
//       .then(folder => {
//         if (!folder) {
//           return res.status(404).json({
//             error: { message: `folder doesn't exist` }
//           })
//         }
//         res.folder = folder // save the folder for the next middleware
//         next() // don't forget to call next so the next middleware happens!
//       })
//       .catch(next)
//   })
//   .get((req, res, next) => {
//     res.json(serializeFolder(res.folder))
//   })
//   .delete((req, res, next) => {
//     FoldersService
//   .deleteFolder(
//       req.app.get('db'),
//       req.params.folder_id
//     )
//       .then(numRowsAffected => {
//         res.status(204).end()
//       })
//       .catch(next)
//     })
//   .patch(jsonParser, (req, res, next) => {
//     const { folder_name } = req.body
//     const folderToUpdate = { folder_name }

//     const numberOfValues = Object.values(folderToUpdate).filter(Boolean).length
//     if (numberOfValues === 0) {
//       return res.status(400).json({
//         error: {
//           message: `Request body must contain 'folder_name'`
//         }
//       })
//     }

//     FoldersService
//   .updateFolder(
//       req.app.get('db'),
//       req.params.folder_id,
//       folderToUpdate
//     )
//       .then(numRowsAffected => {
//         res.status(204).end()
//       })
//       .catch(next)
//     })

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
    .get((req, res) => {
      res.json(res.data)
    })

module.exports = roomDataRouter
