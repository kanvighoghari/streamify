const express = require("express")
const router = express.Router()
const { getAllContacts , getMessagesByUserId , sendMessage ,getChatPartners}  = require("../controller/messageController")
const {protectRoute} = require("../middleware/authMiddleware")
const arcjetProctection = require("../middleware/arcjetMiddleware")

router.use(arcjetProctection ,protectRoute);
router.get("/contacts" , getAllContacts);
router.get("/chats" ,getChatPartners);
router.get("/:id",getMessagesByUserId)
router.post("/send/:id", sendMessage)

module.exports = router