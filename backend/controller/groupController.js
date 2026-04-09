const groupModel = require("../models/groupModel")
const messageModel = require("../models/messageModel")

const createGroup = async (req,res)=>{
    try{
        const {name , members} = req.body

        const group = await groupModel.create({
            name,
            members:[...members , req.user._id],
            admin:req.user._id
        })
        res.json(group)

    }catch(err){
         res.status(500).json({message:"error creating group"})
    }
}

const getUserGroups = async(req,res)=>{
    try{
        const groups = await groupModel.find({
            members:req.user._id
        }).populate("members","username email")
        .populate("admin","username")

        res.json(groups)

    }catch(err){
        res.status(500).json({message:"error fetching groups"})
    }
}

const getGroupMessages = async (req,res)=>{
    try{
        const {groupId} = req.params

        const messages = await messageModel
        .find({groupId})
        .populate("senderId","username email")

        res.json(messages)

    }catch(err){
         res.status(500).json({message:"error fetching messages"})
    }
}



module.exports = {createGroup , getGroupMessages ,getUserGroups }