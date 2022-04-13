const express = require('express')
const router = express.Router()
const User = require('../schemas/user')
const { send } = require("express/lib/response"); //응답해주는 역할을 하는 library
const jwt = require("jsonwebtoken");
const res = require("express/lib/response");
const authMiddleware = require("../routers/auth-middleware")

//회원가입 중복검사
router.post("/users/idCheck", async (req, res) => {
    //회원가입창(프런트앤드)에서 받아오는 값 
    const { id } = req.body;
    const existUsers = await User.find({
        id,
    });
    if (existUsers.length < 1) { //사용자의 정보가 
        res.status(200).send({
           msg: "사용가능한 아이디입니다."
        });
    }
    else if(existUsers.length) { //사용자의 정보가 db에 존재한다면
        res.status(400).send({
            errorMessage: "이미 가입된 아이디가 있습니다."
        });
    }
});


//회원가입
router.post("/users", async (req, res) => {
    //회원가입창(프런트앤드)에서 받아오는 값 
    const { id, password, passwordCheck} = req.body;
    //console.log(id, password, passwordCheck); //값 넘어옴
    
    //이전에 가입한 정보가 없다면, user변수에 저장(회원가입)
    const user = new User({ id, password });
    res.json({ msg: "회원가입이 완료 되었습니다." });
    await user.save(); //user변수 db에 저장

    //새로운 데이터가 생성되었으므로 201 status값 반환해준다.
    res.status(201).send();
});



//로그인 유효성 검사 및 토큰 발급 
router.post("/auth", async (req, res) => {
    const { id, password } = req.body;
     //console.log(id, password); //값 들어옴 

    //exec() 메소드는 일치 검색을 실행합니다. 결과 배열 또는 null 을 반환합니다 .
    // 클라가 입력한 정보로 DB조회 
    const user = await User.findOne({ id, password }).exec();
    // console.log(user); // 값 들어옴 

    if (!user) {  //회원가입된 사용자가 없다면 
        res.status(401).send(
            {errorMessage: "아이디 또는 패스워드를 다시 확인해주세요."}
        );
        return;
    }
    //응답값으로 클라에게 토큰 생성해서 보내줌 
    const token = jwt.sign({ userId: user.userId }, "seceret_my_key");
    res.send({token});
});



router.get('/me', authMiddleware, async (req, res) => {
    try {
        const {user} = res.locals;
        //console.log(user)
        //미들웨어 통과시 사용자정보를 클라에게 전달한다. 
        res.send({user});  
    } catch (error) {
        console.log(`${req.method} ${req.originalUrl} : ${error.message}`);
        res.status(400).send(
            {errorMessage: "사용자 정보를 가져오지 못하였습니다."}
        );
        return;
    }
});



module.exports = router