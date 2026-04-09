const mongoose = require("mongoose")

const groupSchema = new mongoose.Schema({

 name:{
        type:String,
        required:true
    },

    members:[
        {
            type: mongoose.Schema.Types.ObjectId,
            ref:"User"
        }
    ],

    admin:{
        type: mongoose.Schema.Types.ObjectId,
        ref:"User"
    }

},{timestamps:true})

const groupModel = mongoose.model("Group",groupSchema)

module.exports = groupModel