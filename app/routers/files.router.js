const express = require('express')
const { filesHandler } = require('../handlers')
const router = new express.Router()

router
  .route('/data')
  .get(filesHandler.readFiles)

router
  .route('/list')
  .get(filesHandler.readRawFiles)

module.exports = router
