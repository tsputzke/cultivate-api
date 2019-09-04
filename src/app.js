const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const helmet = require('helmet')
const { NODE_ENV } = require('./config')
const foldersRouter = require('./folders/folders-router')
const RoomDataRouter = require('./room_data/room_data-router')
const UsersRouter = require('./users/users-router')
const RoomsRouter = require('./rooms/rooms-router')

const app = express()

const morganOption = (NODE_ENV === 'production')
  ? 'tiny'
  : 'common';

app.use(morgan(morganOption))
app.use(helmet())
app.use(cors())

app.use('/api/folders', foldersRouter)
app.use('/api/users', UsersRouter)
app.use('/api/rooms', RoomsRouter)
app.use('/api/room-data', RoomDataRouter)


app.get('/', (req, res) => {
  res.send('Hello, World!')
})

module.exports = app