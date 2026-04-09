const express = require("express")
const router = express.Router()
const {signUp ,login ,logout , updateProfile} = require("../controller/authController")
const {protectRoute} = require("../middleware/authMiddleware")
const arcjetProctection = require("../middleware/arcjetMiddleware")


// router.get("/test", arcjetProctection ,(req,res)=>{
//     res.status(200).json({message:"test route"})
// })

router.use(arcjetProctection)
router.post("/signup" ,signUp )
router.post("/login",login )
router.post("/logout" , logout )
router.put("/update-profile" ,protectRoute ,updateProfile)
router.get("/check", protectRoute , (req,res)=>res.status(200).json(req.user))

module.exports = router