const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const helmet = require('helmet')
const { NODE_ENV } = require('./config')
const foldersRouter = require('./folders/folders-router')
const notesRouter = require('./notes/notes-router')
const RoomDataRouter = require('./room_data/room_data-router')

const app = express()

const morganOption = (NODE_ENV === 'production')
  ? 'tiny'
  : 'common';

app.use(morgan(morganOption))
app.use(helmet())
app.use(cors())

app.use('/api/folders', foldersRouter)
app.use('/api/notes', notesRouter)
app.use('/api/room-data', RoomDataRouter)

// const RoomDataRouter = express.Router()
// 	RoomDataRouter
//   .route('/card')
//   .get((req, res) => {/* code not shown */})
//   .post((req, res) => {/* code not shown */})


app.get('/api', (req, res) => {
  res.send('all stuff')
})

app.post('/api', (req, res, next) => {
  const { user_name, password } = req.body;

  console.log('password:', password)

  const newUser = { user_name, password }

  for (const [key, value] of Object.entries(newUser))
      if (value == null)
        return res.status(400).json({
          error: `Missing '${key}' in request body`
        })

  UsersService.addUser(
    req.app.get('db'),
    newUser
  )
    .then(user => (
      res 
        .status(201)
    ))
    .catch(next)
})

app.use(function errorHandler(error, req, res, next) {
  let response
  if (NODE_ENV === 'production') {
    response = { error: { message: 'server error' } }
  } else {
    console.error(error)
    response = { message: error.message, error }
  }
  res.status(500).json(response)
})

module.exports = app