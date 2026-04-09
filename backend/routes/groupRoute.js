const express = require("express")
const router = express.Router()
const {createGroup, getGroupMessages , getUserGroups , sendGroupMessage} = require("../controller/groupController")
const {protectRoute} = require("../middleware/authMiddleware")
const arcjetProctection = require("../middleware/arcjetMiddleware")


router.use(arcjetProctection ,protectRoute);
router.post("/create",createGroup)
router.get("/messages/:groupId",getGroupMessages)
router.get("/usergroup",getUserGroups)


module.exports = router