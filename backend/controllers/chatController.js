const Chat = require("../models/Chat");
const Message = require("../models/Messages");
const User = require("../models/User");

// 1. Get or Create Chat
exports.accessChat = async (req, res) => {
  try {
    const { participantId } = req.body;
    const from = req.user.id;

    const receiverExists = await User.findById(participantId);
    if (!receiverExists) {
      return res.status(404).json({ message: "Participant user not found in database!" });
    }

    const key = Chat.makeKey([from, participantId]);
    let chat = await Chat.findOne({ participantsKey: key });

    if (!chat) {
      chat = await Chat.create({
        participants: [from, participantId],
        participantsKey: key,
      });
    }

    res.status(200).json(chat);
  } catch (err) {
    res.status(500).json({ message: "Chat access failed", error: err.message });
  }
};

// 2. Get all messages
exports.getMessages = async (req, res) => {
  try {

    const chatExists = await Chat.findById(req.params.chatId);
    if (!chatExists) {
      return res.status(404).json({ message: "Chat room not found!" });
    }

    const messages = await Message.find({ chatId: req.params.chatId })
      .populate("from to", "username role")
      .sort({ time: 1 });
    res.json(messages);
  } catch (err) {
    res.status(500).json({ message: "Error fetching messages" });
  }
};

// Get all chats for the logged-in user (Inbox)
exports.getMyChats = async (req, res) => {
  try {
    const chats = await Chat.find({ participants: req.user.id })
      .populate("participants", "username role email")
      .sort({ updatedAt: -1 });
    res.json(chats);
  } catch (err) {
    res.status(500).json({ message: "Error fetching inbox" });
  }
};

// 3. SEND MESSAGE
exports.sendMessage = async (req, res) => {
  try {
    const from = req.user.id;
    const { chatId, participantId, text } = req.body;

    // CHECK 3: Validation checks
    const chatExists = await Chat.findById(chatId);
    const receiverExists = await User.findById(participantId);

    if (!chatExists || !receiverExists) {
      return res.status(400).json({ message: "Invalid Chat ID or Participant ID. Message not sent." });
    }

    const message = await Message.create({
      chatId,
      from,
      to: participantId,
      text,
      time: new Date()
    });

    await Chat.findByIdAndUpdate(chatId, {
      lastMessage: text,
      lastMessageTime: new Date()
    });

    const populatedMsg = await message.populate("from to", "username role");
    res.status(201).json(populatedMsg);
  } catch (err) {
    res.status(500).json({ message: "Message send failed", error: err.message });
  }
};
