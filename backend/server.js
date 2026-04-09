const dns = require('node:dns/promises');
dns.setServers(['1.1.1.1', '8.8.8.8']);

const express = require('express')
const dotenv = require("dotenv")
const path = require("path")
const connectDB = require("./lib/db")
const cookieParser = require("cookie-parser")
const cors = require("cors")
const {app , server} = require("./lib/socket")

dotenv.config()


const port = process.env.PORT || 5000


app.use(express.json({ limit: "10mb" }))
app.use(cors({origin:process.env.CLIENT_URL , credentials:true}))
app.use(cookieParser())

const authRoute = require("./routes/authRoute")
const messageRoute = require("./routes/messageRoute")
const groupRoutes = require("./routes/groupRoute")

app.use("/api/auth", authRoute)
app.use("/api/messages" ,messageRoute )
app.use("/api/groups", groupRoutes)

if(process.env.NODE_ENV==="production"){
  app.use(express.static(path.join(__dirname,"../frontend/dist")))
  app.get("*",(req,res)=>{
    res.sendFile(path.join(__dirname,"../frontend/dist/index.html"))
  })
}

const startServer = async () => {
  try {
    await connectDB()
    console.log("Database connected successfully")

    server.listen(port, () => {
      console.log(`Server is running on port ${port}`)
    })

  } catch (err) {
    console.error("DB connection failed:", err)
  }
}

startServer();