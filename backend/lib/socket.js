const express = require("express")
const http = require("http")
const { Server } = require("socket.io")
const socketAuthMiddleware = require("../middleware/socketAuthMiddleware") 
const groupModel = require("../models/groupModel");
const messageModel = require("../models/messageModel")

const app = express()
const server = http.createServer(app)

const io = new Server(server,{
    cors:{
       origin: process.env.NODE_ENV === "production" 
            ? process.env.CLIENT_URL  
            : [process.env.CLIENT_URL],
    }
})

//online user
const userSocketMap ={};
io.use(socketAuthMiddleware)

function getRecevierSocketId(userId){

    return userSocketMap[userId.toString()]
}




io.on("connection" , async (socket)=>{

    console.log("A user connected" , socket.user.username)

    const userId = socket.userId
    userSocketMap[userId.toString()] = socket.id


    const groups = await groupModel.find({members:userId})
    groups.forEach((group)=>{
        socket.join(group._id.toString())
        console.log(`Joined group: ${group._id}`);
    })

    socket.on("sendGroupMessage", async ({ groupId, text, image }) => {

    const newMessage = await messageModel.create({
        senderId: socket.userId,
        groupId: groupId,
        text: text,
        image: image
    });


    io.to(groupId.toString()).emit("receiveGroupMessage", {
        ...newMessage.toObject(),   
        senderName: socket.user.username
    });
});

    socket.on("createGroup", ({ groupId, members }) => {
        socket.join(groupId);
        members.forEach((memberId) => {
            const memberSocketId = userSocketMap[memberId.toString()];

            if (memberSocketId) {
            io.to(memberSocketId).socketsJoin(groupId);
            }
        });

        console.log(`Group ${groupId} created and members joined`);
    });

 

  
    io.emit("getOnlineUsers" , Object.keys(userSocketMap))

  socket.on("disconnect", () => {
   console.log("A user disconnected", socket.user.username);
   delete userSocketMap[userId.toString()];
   io.emit("getOnlineUsers", Object.keys(userSocketMap));
});
})

module.exports = {app,io,server , getRecevierSocketId}