const express = require('express')
const loginRouter = require('./login')
const registerRouter = require('./register')

const router = express.Router()

router.use('/user/login', loginRouter)
router.use('/user/register', registerRouter)

module.exports = router 


