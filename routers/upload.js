const express = require('express');
const router = express.Router();
const path = require("path");

let AWS = require("aws-sdk");
AWS.config.loadFromPath(__dirname + "/../config/awsconfig.json"); // 인증
let s3 = new AWS.S3();

let multer = require("multer");
let multerS3 = require('multer-s3');
let upload = multer({

    storage: multerS3({
        s3: s3,
        bucket: "modak-storage",
        key: function (req, file, cb) {
             let extension = path.extname(file.originalname);
             cb(null, Date.now().toString() + extension)
        },
        acl: 'public-read-write',
    })

})


router.post('/upload', upload.single("imgFile"), function(req, res, next){
    console.log(req.file)
})

module.exports = router