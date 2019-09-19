
const bcrypt = require('bcryptjs')
const xss = require('xss')
const jwt = require('jsonwebtoken')
const config = require('../config')

const REGEX_UPPER_LOWER_NUMBER_SPECIAL = /(?=.*[0-9])(?=.*[!@#\$%\^&])[\S]+/

const UsersService = {
  hasUsername(db, user_name) {
    return db('cultivate_users')
      .where({ user_name })
      .first()
      .then(user => !!user)
  },
  addUser(db, newUser) {
    return db
      .insert(newUser)
      .into('cultivate_users')
      .returning('*')
      .then(([user]) => user)
  },
  validatePassword(password) {
    if (password.length < 8) {
      return 'Password must be longer than 8 characters'
    }
    if (password.length > 72) {
      return 'Password must be less than 72 characters'
    }
    if (password.startsWith(' ') || password.endsWith(' ')) {
      return 'Password must not start or end with empty spaces'
    }
    if (!REGEX_UPPER_LOWER_NUMBER_SPECIAL.test(password)) {
      return 'Password must contain at least one number and one special character.'
    }
    return null
  },
  hashPassword(password) {
    return bcrypt.hash(password, 10)
  },
  serializeUser(user) {
    return {
      id: user.id,
      user_name: xss(user.user_name),
    }
  },
  roomsByUser(knex, id) {
    return knex.from('rooms').select('*').where('user_id', id)
  },

  // Auth -- Login
  getUserWithUserName(db, user_name) {
    return db('cultivate_users')
      .where({ user_name })
      .first()
  },
  comparePasswords(password, hash) {
    return bcrypt.compare(password, hash)
  },
  createJwt(subject, payload) {
    return jwt.sign(payload, config.JWT_SECRET, {
      subject,
      expiresIn: config.JWT_EXPIRY,
      algorithm: 'HS256',
    })
  },
  verifyJwt(token) {
    return jwt.verify(token, config.JWT_SECRET, {
      algorithms: ['HS256'],
    })
  },
  parseBasicToken(token) {
    return Buffer
      .from(token, 'base64')
      .toString()
      .split(':')
  },
}

module.exports = UsersService
