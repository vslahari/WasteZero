const mongoose = require("mongoose");

const chatSchema = new mongoose.Schema(
  {
    participants: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
    ],

    participantsKey: { type: String, unique: true },
    lastMessage: String,
    lastMessageTime: Date,
  },
  { timestamps: true }
);

// Helper function to create unique key
function computeParticipantsKey(participants) {
  const ids = participants
    .map((p) => {
      if (!p) return null;
      if (typeof p === "string") return p;
      if (p._id) return p._id.toString();
      if (p.toString) return p.toString();
      return null;
    })
    .filter(Boolean);

  if (ids.length !== 2) {
    throw new Error("Participants must contain exactly 2 valid user IDs.");
  }

  return ids.sort().join("_");
}

chatSchema.statics.makeKey = function (participants) {
  return computeParticipantsKey(participants);
};

const Chat = mongoose.model("Chat", chatSchema);
module.exports = Chat;