const Chat = require("../models/Chat");
const Message = require("../models/Messages");
const jwt = require("jsonwebtoken");

// Track online users: userId -> Set of socketIds
const onlineUsers = new Map();

const socketHandler = (io) => {
  io.on("connection", (socket) => {
    // Authenticate socket connection and register user as online
    const token = socket.handshake.auth?.token;
    let userId = null;

    if (token) {
      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        userId = decoded.id;

        // Add to online users map
        if (!onlineUsers.has(userId)) {
          onlineUsers.set(userId, new Set());
        }
        onlineUsers.get(userId).add(socket.id);

        // Broadcast to all clients that this user is now online
        io.emit("user_online", userId);
        console.log(`User ${userId} is now online`);
      } catch (err) {
        console.error("Socket auth error:", err.message);
      }
    }

    // Send current online users list to the newly connected client
    socket.emit("online_users", Array.from(onlineUsers.keys()));

    socket.on("join_chat", (chatId) => {
      socket.join(chatId);
      console.log(`User joined chat: ${chatId}`);
    });

    // Join personal notification room
    socket.on("join", (uid) => {
      socket.join(uid);
      console.log(`User ${uid} joined their notification room`);
    });

    socket.on("send_message", async (data) => {
      const { chatId, from, to, text } = data;

      try {
        const broadcastMessage = {
          chatId,
          from: { _id: from },
          to,
          text,
          time: new Date(),
        };

        socket.to(chatId).emit("receive_message", broadcastMessage);

      } catch (err) {
        console.error("Socket error:", err);
      }
    });

    socket.on("disconnect", () => {
      if (userId) {
        const sockets = onlineUsers.get(userId);
        if (sockets) {
          sockets.delete(socket.id);
          // Only mark offline if no remaining connections for this user
          if (sockets.size === 0) {
            onlineUsers.delete(userId);
            io.emit("user_offline", userId);
            console.log(`User ${userId} is now offline`);
          }
        }
      }
      console.log("Client disconnected:", socket.id);
    });
  });
};

module.exports = socketHandler;