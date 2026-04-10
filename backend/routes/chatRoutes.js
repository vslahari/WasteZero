const express = require("express");
const router = express.Router();
const {auth} = require("../middleware/authMiddleware");
const { 
    accessChat, 
    getMessages, 
    sendMessage, 
    getMyChats 
} = require("../controllers/chatController");

router.get("/", auth, getMyChats);
router.post("/", auth, accessChat); 

router.get("/:chatId", auth, getMessages); 
router.post("/send", auth, sendMessage);

module.exports = router;