const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
            index: true
        },
        type: {
            type: String,
            enum: ["application", "approval", "rejection", "message", "match"],
            required: true
        },
        message: {
            type: String,
            required: true
        },
        isRead: {
            type: Boolean,
            default: false,
            index: true
        },
        data: {
            opportunityId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Opportunity"
            },
            volunteerId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User"
            },
            ngoId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User"
            },
            action: String,
            metadata: mongoose.Schema.Types.Mixed
        }
    },
    { timestamps: true }
);

// Index for efficient queries
notificationSchema.index({ userId: 1, createdAt: -1 });
notificationSchema.index({ userId: 1, isRead: 1 });

module.exports = mongoose.model("Notification", notificationSchema);
