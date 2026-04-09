const jwt = require("jsonwebtoken")
const userModel = require("../models/userModel")

const protectRoute = async (req,res,next)=>{
   try{
     console.log("Cookies:", req.cookies); 
     const token = req.cookies.token
     if(!token) return res.status(401).json({mesage:"Unauthorized"})

      const decoded =  jwt.verify(token,process.env.JWT_SECRET)
      if(!decoded) return res.status(401).json({mesage:"Unauthorized"})
    
    const user = await userModel.findById(decoded.userId)
    if(!user) return res.status(404).json({mesage:"User not found"})
    
    req.user = user
    next()

   }catch(err){
    console.log("error in protected route middleware: " , err)
    res.status(500).json({message:"Internal Server error"})
   }
}

module.exports = {protectRoute}