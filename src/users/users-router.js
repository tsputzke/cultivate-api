const express = require('express')
const UsersService = require('./users-service')
const path = require('path')
const { requireAuth } = require('../middleware/jwt-auth')

const usersRouter = express.Router()
const jsonBodyParser = express.json()

// Route to post new user
usersRouter
  .post('/', jsonBodyParser, (req, res, next) => {
    const { user_name, password } = req.body;
      
    // Check request for user_name and password
    for (const field of ['user_name', 'password'])
      if (!req.body[field])
        return res.status(400).json({
          error: `Missing '${field}' in request body`
        })
      
    // Validate password
    const passwordError = UsersService.validatePassword(password)

    if (passwordError)
      return res.status(400).json({ error: passwordError }) 

    // Check is user_name is taken
    UsersService.hasUsername(
        req.app.get('db'),
        user_name
    )
    .then(hasUsername => {
      if (hasUsername)
        return res.status(400).json({ error: `Username is already taken` })

      return UsersService.hashPassword(password)
        .then(hashedPassword => {
          const newUser = {
            user_name,
            password: hashedPassword
          }

          return UsersService.addUser(
            req.app.get('db'),
            newUser
          )
            .then(user => {
              res
                .status(201)
                .location(path.posix.join(req.originalUrl, `/${user.id}`))
                .json(UsersService.serializeUser(user))
            })
        })
    })
    .catch(next)
  })

  // Get all rooms belonging to a user, by user_id
  usersRouter
    .route('/:user_id')
    .all(requireAuth)
    .all((req, res, next) => {
      UsersService
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

module.exports = usersRouter