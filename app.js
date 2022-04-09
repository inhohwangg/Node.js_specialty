const express = require('express')
const jwt = require("jsonwebtoken"); //jwt 모듈 불러오기 
const renders = require('./renders')
const router = require('./routers')

const app = express()

app.use(express.urlencoded({extended: false}), router)
app.use(express.json())

app.set('views', __dirname + '/views')
app.set('view engine', 'ejs')

const connect = require('./schemas')
connect()

app.use('/api', router)
app.use('/api/user', router)
app.use('/', renders)

app.listen(3000, () => {
    console.log('3000번 서버가 정상적으로 켜졌습니다')
})

module.exports = app