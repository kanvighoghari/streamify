const bcrypt = require("bcrypt");
const userModel = require("../models/userModel")
const generateToken = require("../lib/utils");
const sendWelcomeEmail = require("../emails/emailHandlers");
const cloudinary  = require("../lib/cloudinary");



const signUp = async (req,res)=>{
  const {username , email , password} = req.body;
    try{
        if(!username|| !password|| !email){
            return res.status(400).json({message: "all field are required"})
        }
        if(password.length < 6){
            return res.status(400).json({message: "Password must be 6 character "})
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
            if(!emailRegex.test(email)){
                return res.status(400).json({message: "Invalid Email"})
        }

        const isAlreadyExists = await userModel.findOne({email})
        if(isAlreadyExists){
           return res.status(400).json({message: "Email already exists"}) 
        }

        const salt = await bcrypt.genSalt(10)
        const hash = await bcrypt.hash(password,salt)
        const newUser = await userModel.create({
        email,
        username,
        password:hash
        })
        if(newUser){ 
            generateToken(newUser._id , res);    
    
            res.status(201).json({
            _id:newUser._id,
            username: newUser.username,
            email:newUser.email,
            profilePic:newUser.profilePic
            })

            try{
                await sendWelcomeEmail(newUser.email, newUser.username, process.env.CLIENT_URL )
            }catch(error){
                console.error("Resend Error Details:", error)
            }


        }else{
            return res.status(400).json({message: "Invalid user data"}) 
        }

    }catch(err){
        return res.status(500).json({
        message: " Internal Server error",
        err: err.message
        })      
    }
}

const login = async (req,res)=>{
    const{email ,password} = req.body;

    if(!email||!password){
        return res.status(400).json({message: "Both field are required"})
    }
    try{
        const user = await userModel.findOne({email})
        if(!user) return res.status(400).json({message: "Invalid Credentials"})
        
        const correctPassword = await bcrypt.compare(password,user.password)
        if(!correctPassword) return res.status(400).json({message: "Invalid Credentials"})

        generateToken(user._id , res)

         res.status(201).json({
            _id:user._id,
            username: user.username,
            email:user.email,
            profilePic:user.profilePic
            })
    }catch(err){
        return res.status(500).json({
        message: " Internal Server error",
        err: err.message
       })
    }
}

const logout = (req,res)=>{
    res.clearCookie("token" ,{maxAge:0}, { 
    httpOnly: true,
    sameSite: "none",  
    secure: true 
})
    res.status(200).send("user logged out successfullyy")
}

const updateProfile = async(req,res)=>{
    try{
        const {profilePic} = req.body;
        if(!profilePic)  return res.status(400).json({message:"profile pic required"})

        
       const userId = req.user._id
       const uploadResponse = await cloudinary.uploader.upload(profilePic, {
    folder: "profile_pics",
  resource_type: "image"
})
       const updatedUser = await userModel.findByIdAndUpdate(
            userId ,
            {profilePic:uploadResponse.secure_url} ,
            {new:true}
        )

        res.status(200).json(updatedUser)


    }catch(err){
        console.log("FULL ERROR:", err)
         return res.status(500).json({
        message: " Internal Server error",
        err: err.message
       })
    }

}

module.exports = { signUp , login , logout , updateProfile }