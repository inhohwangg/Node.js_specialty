const express = require('express')
const jwt = require("jsonwebtoken"); //jwt 모듈 불러오기 
const renders = require('./renders')
const router = require('./routers')
const cors = require('cors')
const app = express()
const fs = require('fs'); // 파일시스템

const socketIo = require('socket.io')
const Http = require('http')
const http = Http.createServer(app)
// // 모든 도메인 허용 

const io = socketIo(http, {
    cors : {
        origin:"*", //여기에 명시된 서버만 호스트만 내서버로 연결을 허용할거야
        mothods:["GET","POST","DELETE"]
    },
})


// 모든 도메인 허용 
app.use(cors());


app.use(express.static('uploadedFiles'))
app.use(express.urlencoded({extended: false}), router)
app.use(express.json())

app.set('views', __dirname + '/views')
app.set('view engine', 'ejs')

const connect = require('./schemas');
const { Iot } = require('aws-sdk');
connect()


app.use('/api', router)
app.use('/', renders)  



http.listen(3000, () => {
    console.log('3000번 서버가 정상적으로 켜졌습니다')
})

io.on("connection", (socket)=> {
    console.log("연결이되었습니다.")

    
})



module.exports = app