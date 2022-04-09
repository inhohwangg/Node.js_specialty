const mongoose = require('mongoose')
const {Schema} = mongoose

const write_modifySchema = ({
    title: {
        type: String,
      
      }, 
      image: {
        type: String,
      
      }, 
      content: {
        type: String,
        
      },
      createdAt : {
        type : String,
        
    },
      post_id: {
        type: Number,    
        
      }
    });

module.exports = mongoose.model('Write_modify', write_modifySchema)