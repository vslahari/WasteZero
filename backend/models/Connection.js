const mongoose = require('mongoose');

const connectionSchema = new mongoose.Schema({
    senderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    receiverId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    status: {
        type: String,
        enum: ['pending', 'accepted', 'rejected'],
        default: 'pending'
    }
}, { timestamps: true });

// Index for faster queries
connectionSchema.index({ senderId: 1, receiverId: 1 });
connectionSchema.index({ status: 1 });

module.exports = mongoose.model('Connection', connectionSchema);
