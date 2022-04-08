const mongoose = require('mongoose')
const {Schema} = mongoose

const write_modifySchema = ({
    title : String,
    image: {
        date : Buffer,
        contentType : String,
    },
    content : String,
    createdAt : {
        type : Date,
        default : Date.now,
    }
})

module.exports = mongoose.model('Wrire_modify', write_modifySchema)