const express = require('express')
const router = express.Router()

//postadd
router.get('/',(req,res)=>{
    res.render("write")
});

  module.exports = router