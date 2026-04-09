const userModel = require("../models/userModel")
const messageModel = require("../models/messageModel")
const cloudinary = require("../lib/cloudinary")
const { getRecevierSocketId , io } = require("../lib/socket")



const  getAllContacts = async (req,res)=>{
    try{
        const loggedInUser = req.user.id
        const filterData = await userModel.find({_id:{$ne:loggedInUser}}).select("-password")

        res.status(200).json(filterData)

    }catch(err){
        console.log("error in getAllContacts: ", err)
        res.status(500).json({message:"Internal server error"})
    }
}

const getMessagesByUserId = async (req,res)=>{
    try{
        const myId = req.user._id
        const {id:userToChatId } = req.params;

        const message = await messageModel.find({
            $or:[
                {senderId:myId, receiverId: userToChatId},
                {senderId:userToChatId, receiverId:myId}
            ]
        })
          groupId: null

        res.status(200).json(message)

    }catch(err){
        console.log("error in getMessagesByUserId: ", err)
        res.status(500).json({message:"Internal server error"})
    }
}

const sendMessage = async (req, res) => {
    console.log("📨 sendMessage hit")
    try {
        const { text, image, groupId } = req.body;
        const { id: receiverIdParam } = req.params;
        const senderId = req.user._id

        if (!text && !image) {
            return res.status(400).json({ message: "Text or image is required." });
        }

        const isGroup = !!groupId;
        const receiverId = isGroup ? null : receiverIdParam;

        if (!isGroup) {
            if (senderId.equals(receiverId)) {
                return res.status(400).json({ message: "Cannot send messages to yourself." })
            }
            const receiverExists = await userModel.exists({ _id: receiverId })
            if (!receiverExists) {
                return res.status(404).json({ message: "Receiver not found." })
            }
        }

        let imageUrl
        if (image) {
            const uploadResponse = await cloudinary.uploader.upload(image)
            imageUrl = uploadResponse.secure_url
        }

        const newMessage = new messageModel({
            senderId,
            receiverId: isGroup ? null : receiverId,
            groupId: isGroup ? groupId : null,
            text,
            image: imageUrl
        })

        await newMessage.save();


        if (!isGroup) {
            const receiverSocketId = getRecevierSocketId(receiverId)
            if (receiverSocketId) {
                io.to(receiverSocketId).emit("newMessage", newMessage)
            }
        }

        res.status(200).json(newMessage)

    } catch (err) {
        console.log("error in sendMessage: ", err)
        res.status(500).json({ message: "Internal server error" })
    }
}
const getChatPartners =  async (req,res)=>{
    try{
        const loggedInUser = req.user._id

        const messages = await messageModel.find({
            $or:[
                {senderId:loggedInUser} , {receiverId:loggedInUser}
            ],
            groupId: null
        })

     const chatPartnerIds = [
      ...new Set(
        messages.map((msg) =>{
          if (!msg.senderId || !msg.receiverId) return null;

           return msg.senderId.toString() === loggedInUser.toString()
            ? msg.receiverId.toString()
            : msg.senderId.toString()
        })

        .filter((id) => id !== null)
      ),
    ];

    const chatPartners = await userModel.find({ _id: { $in: chatPartnerIds } }).select("-password");

    res.status(200).json(chatPartners);
 
    }catch(err){
         console.log("error in sendMessage: ", err)
        res.status(500).json({message:"Internal server error"})
    }
}

module.exports =  {getAllContacts , getMessagesByUserId , sendMessage , getChatPartners}