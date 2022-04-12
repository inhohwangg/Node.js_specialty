const jwt = require("jsonwebtoken")  //jwt 모듈 불러오기 
const User = require("../schemas/user")


module.exports = (req, res, next) => {
    const {authorization} = req.headers;
    console.log(authorization)
    const [tokenType, tokenValue] = authorization.split(' '); //토큰의 유효성을 확인하겠다.
    if (tokenType !== 'Bearer') {
        res.status(401).send({
            errorMessage: "로그인 후 사용하세요.",
        });
        return;
    }
    try {          
        const {userId} = jwt.verify(tokenValue, "seceret_my_key");
        //console.log(userId)
        User.findById(userId).then((user) => {
            res.locals.user = user;
            next();
        });
              //  console.log(user)    
    } catch (error) {
        res.status(401).send({
            errorMessage: "로그인 후 사용하세요.",
        });
        return;
    }
};



