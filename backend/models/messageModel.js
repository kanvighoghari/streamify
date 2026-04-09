const mongoose = require("mongoose")

const messageSchema = new mongoose.Schema({
    senderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    receiverId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    groupId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Group"
    },
    text: {
      type: String,
      trim: true,
      maxlength: 2000,
    },
    image: {
      type: String,
    },
  },
  { timestamps: true }
);

const messageModel = mongoose.model("Message" , messageSchema)

module.exports = messageModel