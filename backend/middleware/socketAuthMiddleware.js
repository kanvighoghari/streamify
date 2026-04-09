const jwt = require("jsonwebtoken")
const userModel = require("../models/userModel")

const socketAuthMiddleware = async (socket,next)=>{
    try {
        const token = socket.handshake.headers.cookie
        ?.split("; ")
        .find((row)=>row.startsWith("token="))
        ?.split("=")[1];

        if (!token){
            console.log("Socket connection rejected: NO token provided")
            return next(new Error("Unathuorized - no token provided"))
        }

        const decoded = jwt.verify(token , process.env.JWT_SECRET);
        if(!decoded){
             console.log("Socket connection rejected:  Invalid Token")
            return next(new Error("Unathuorized - Invalid token"))
        }

        const user = await userModel.findById(decoded.userId).select("-password");
        if(!user){
            console.log("Socket connection rejected:  User not found ")
            return next(new Error("User Not Found"))
        }

        socket.user = user;
        socket.userId = user._id.toString()

        console.log(`Socket authenticated for user: ${user.username} (${user._id})`)


        next()
        
    } catch (error) {
       console.log("Error in socket authentication:", error.message);
       next(new Error("Unauthorized - Authentication failed"));     
    }

}

module.exports = socketAuthMiddleware