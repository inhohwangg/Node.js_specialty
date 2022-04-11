const express = require('express')
const jwt = require("jsonwebtoken"); //jwt 모듈 불러오기 
const renders = require('./renders')
const router = require('./routers')
const cors = require('cors')
const app = express()
const fs = require('fs'); // 파일시스템

// // 모든 도메인 허용 
app.use(cors());


app.use(express.static('uploadedFiles'))
app.use(express.urlencoded({extended: false}), router)
app.use(express.json())

app.set('views', __dirname + '/views')
app.set('view engine', 'ejs')

const connect = require('./schemas')
connect()

app.use('/api', router)
// app.use('/api/user', router)
// app.use('/', renders)


app.listen(3000, () => {
    let dir = './uploadedFiles';     
  if (!fs.existsSync(dir)) fs.mkdirSync(dir); // 서버가 켜졌을때 업로드 폴더가 없으면 업로드 폴더생성
    console.log('3000번 서버가 정상적으로 켜졌습니다')
})



module.exports = app