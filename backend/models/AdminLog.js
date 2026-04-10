const mongoose = require("mongoose");

const adminLogSchema = new mongoose.Schema(
    {
        action: {
            type: String,
            required: true
        },
        user_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        details: {
            type: String,
            default: ""
        }
    },
    { timestamps: { createdAt: 'timestamp', updatedAt: false } }
);

module.exports = mongoose.model("AdminLog", adminLogSchema);
