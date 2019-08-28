const express = require('express')
const xss = require('xss')
const FoldersService = require('./folders-service')
const path = require('path')

const foldersRouter = express.Router()
const jsonParser = express.json()

const serializeFolder = folder => ({
  id: folder.id,
  folder_name: folder.folder_name,
  date_published: folder.date_published,
})

foldersRouter
  .route('/')
  .get((req, res, next) => {
    const knexInstance = req.app.get('db')
    FoldersService
  .getAllFolders(knexInstance)
      .then(folders => {
        res.json(folders.map(serializeFolder))
      })
      .catch(next)
  })
  .post(jsonParser, (req, res, next) => {
    const { folder_name } = req.body
    const newfolder = { folder_name }

    for (const [key, value] of Object.entries(newfolder))
      if (value == null)
        return res.status(400).json({
          error: { message: `Missing '${key}' in request body` }
        })

    FoldersService
  .insertFolder(
      req.app.get('db'),
      newfolder
    )
      .then(folder => {
        res
          .status(201)
          .location(path.posix.join(req.originalUrl, `/${folder.id}`))
          .json(serializeFolder(folder))
      })
      .catch(next)
  })

foldersRouter
  .route('/:folder_id')
  .all((req, res, next) => {
    FoldersService
  .getById(
      req.app.get('db'),
      req.params.folder_id
    )
      .then(folder => {
        if (!folder) {
          return res.status(404).json({
            error: { message: `folder doesn't exist` }
          })
        }
        res.folder = folder // save the folder for the next middleware
        next() // don't forget to call next so the next middleware happens!
      })
      .catch(next)
  })
  .get((req, res, next) => {
    res.json(serializeFolder(res.folder))
  })
  .delete((req, res, next) => {
    FoldersService
  .deleteFolder(
      req.app.get('db'),
      req.params.folder_id
    )
      .then(numRowsAffected => {
        res.status(204).end()
      })
      .catch(next)
    })
  .patch(jsonParser, (req, res, next) => {
    const { folder_name } = req.body
    const folderToUpdate = { folder_name }

    const numberOfValues = Object.values(folderToUpdate).filter(Boolean).length
    if (numberOfValues === 0) {
      return res.status(400).json({
        error: {
          message: `Request body must contain 'folder_name'`
        }
      })
    }

    FoldersService
  .updateFolder(
      req.app.get('db'),
      req.params.folder_id,
      folderToUpdate
    )
      .then(numRowsAffected => {
        res.status(204).end()
      })
      .catch(next)
    })

module.exports = foldersRouter