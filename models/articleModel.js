const mongoose = require('mongoose');
const articleSchema = mongoose.Schema({
    userID:{
        type:String,
        required:true
    },
    content:{
        type:String,
        required:true
    },
    image:{
        type:String,

    },
    tag:{
        type:String,
    },
    likes:{
        type:Array,
        default:[]
    },
    comments:{
        type:Array,
        default:[]
    }
}, { timestamps: true })
module.exports = mongoose.model('Article',articleSchema)