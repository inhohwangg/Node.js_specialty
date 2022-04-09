const express = require('express')
const loginRouter = require('./login')
const registerRouter = require('./register')
const writeRouter = require('./write')
const detailRouter = require('./detail')
const mainRouter = require('./main')

const router = express.Router()

router.use('/', loginRouter)
router.use('/user/register', registerRouter)
router.use('/user/main', mainRouter)
router.use('/user/detail', detailRouter)
router.use('/user/write', writeRouter)

module.exports = router 

 





