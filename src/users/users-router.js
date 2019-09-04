const express = require('express')
const xss = require('xss')
const UsersService = require('./users-service')
const path = require('path')

const usersRouter = express.Router()
const jsonParser = express.json()

const serializeUser = user => ({
  id: user.id,
  user_name: user.user_name,
  password: user.password,
})

// Routes (get/post) for getting all users, posting new user
usersRouter
  .route('/')
  .get((req, res, next) => {
    const knexInstance = req.app.get('db')
    UsersService
  .getAllUsers(knexInstance)
      .then(users => {
        res.json(users.map(serializeUser))
      })
      .catch(next)
  })
  .post(jsonParser, (req, res, next) => {
    const { user_name, password } = req.body;
    const newUser = { user_name, password };
      
    for (const [key, value] of Object.entries(newUser))
      if (value == null)
        return res.status(400).json({
          error: { message: `Missing '${key}' in request body` }
        })
      
    UsersService
      .addUser(
        req.app.get('db'),
        newUser
      )
        .then(user => (
          res 
            .status(201)
            .location(path.posix.join(req.originalUrl, `/${user.id}`))
            .json(serializeUser(user))
        ))
        .catch(next)
  })

usersRouter
  .route('/:user_name')
  .all((req, res, next) => {
    UsersService
  .checkForUser(
      req.app.get('db'),
      req.params.user_name
    )
      .then(user => {
        if (!user) {
          return res.status(404).json({
            error: { message: `user doesn't exist` }
          })
        }
        res.user = user 
        next() 
      })
      .catch(next)
  })
  .get((req, res, next) => {
    res.json(serializeUser(res.user))
  })
  .post(jsonParser, (req, res, next) => {
    const { user_name, password } = req.body;
    const checkUser = { user_name, password };
      
    console.log(checkUser)
    
    res.send(checkUser)    
  })

module.exports = usersRouter