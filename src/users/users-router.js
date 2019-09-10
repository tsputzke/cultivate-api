const express = require('express')
const UsersService = require('./users-service')
const path = require('path')

const usersRouter = express.Router()
const jsonBodyParser = express.json()

// Routes (get/post) for getting all users, posting new user
usersRouter
  .post('/', jsonBodyParser, (req, res, next) => {
    const { user_name, password } = req.body;
      
    for (const field of ['user_name', 'password'])
      if (!req.body[field])
        return res.status(400).json({
          error: `Missing '${field}' in request body`
        })
      
    const passwordError = UsersService.validatePassword(password)

    if (passwordError)
      return res.status(400).json({ error: passwordError }) 

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
  .post(jsonBodyParser, (req, res, next) => {
    const { user_name, password } = req.body;
    const checkUser = { user_name, password };
      
    console.log(checkUser)
    
    res.send(checkUser)    
  })

module.exports = usersRouter