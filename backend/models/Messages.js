const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema({
  chatId: { type: mongoose.Schema.Types.ObjectId, ref: "Chat" },
  from: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  to: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  text: String,
  type: { type: String, enum: ["text", "image", "file"], default: "text" },
  time: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Messages", messageSchema);