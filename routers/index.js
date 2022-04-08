const express = require('express')
const User = require('./user')
const Write_modify = require('./write_modify')

const router = express.Router()

router.use('/write_modify/', Write_modify)
router.use('/', User)

module.exports = router