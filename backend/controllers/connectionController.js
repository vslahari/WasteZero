const Connection = require('../models/Connection');
const User = require('../models/User');

// Get all accepted connections for a user
exports.getConnections = async (req, res) => {
    try {
        const userId = req.user.id;

        const connections = await Connection.find({
            $or: [
                { senderId: userId, status: 'accepted' },
                { receiverId: userId, status: 'accepted' }
            ]
        })
            .populate('senderId', 'username email role')
            .populate('receiverId', 'username email role');

        res.json(connections);
    } catch (error) {
        console.error('Error fetching connections:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Get all connection statuses for a user (pending, accepted)
exports.getConnectionStatus = async (req, res) => {
    try {
        const userId = req.user.id;

        const connections = await Connection.find({
            $or: [
                { senderId: userId },
                { receiverId: userId }
            ]
        })
            .populate('senderId', 'username email role')
            .populate('receiverId', 'username email role');

        res.json(connections);
    } catch (error) {
        console.error('Error fetching connection status:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Send a connection request
exports.sendConnectionRequest = async (req, res) => {
    try {
        const senderId = req.user.id;
        const { toId } = req.body;

        if (!toId) {
            return res.status(400).json({ message: 'Receiver ID is required' });
        }

        if (senderId === toId) {
            return res.status(400).json({ message: 'Cannot send connection request to yourself' });
        }

        // Check if an active or pending connection already exists
        const existingConnection = await Connection.findOne({
        $or: [
            { senderId, receiverId: toId },
            { senderId: toId, receiverId: senderId }
        ]   ,
        status: { $in: ['pending', 'accepted'] }
        });

        if (existingConnection) {
    return res.status(400).json({ 
        message: existingConnection.status === 'pending' 
            ? 'Request already pending' 
            : 'Already connected' 
    });
        }

        const connection = new Connection({
            senderId,
            receiverId: toId,
            status: 'pending'
        });

        await connection.save();

        const populatedConnection = await Connection.findById(connection._id)
            .populate('senderId', 'username email role')
            .populate('receiverId', 'username email role');

        res.status(201).json(populatedConnection);
    } catch (error) {
        console.error('Error sending connection request:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Accept a connection request
exports.acceptConnectionRequest = async (req, res) => {
    try {
        const userId = req.user.id;
        const { connectionId } = req.body;

        if (!connectionId) {
            return res.status(400).json({ message: 'Connection ID is required' });
        }

        const connection = await Connection.findById(connectionId);

        if (!connection) {
            return res.status(404).json({ message: 'Connection request not found' });
        }

        // Verify the user is the receiver
        if (connection.receiverId.toString() !== userId) {
            return res.status(403).json({ message: 'Not authorized to accept this request' });
        }

        if (connection.status !== 'pending') {
            return res.status(400).json({ message: 'Connection request is not pending' });
        }

        connection.status = 'accepted';
        await connection.save();

        const populatedConnection = await Connection.findById(connection._id)
            .populate('senderId', 'username email role')
            .populate('receiverId', 'username email role');

        res.json(populatedConnection);
    } catch (error) {
        console.error('Error accepting connection:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Reject a connection request
exports.rejectConnectionRequest = async (req, res) => {
    try {
        const userId = req.user.id;
        const { connectionId } = req.body;

        if (!connectionId) {
            return res.status(400).json({ message: 'Connection ID is required' });
        }

        const connection = await Connection.findById(connectionId);

        if (!connection) {
            return res.status(404).json({ message: 'Connection request not found' });
        }

        // Verify the user is the receiver
        if (connection.receiverId.toString() !== userId) {
            return res.status(403).json({ message: 'Not authorized to reject this request' });
        }

        if (connection.status !== 'pending') {
            return res.status(400).json({ message: 'Connection request is not pending' });
        }

        connection.status = 'rejected';
        await connection.save();

        const populatedConnection = await Connection.findById(connection._id)
            .populate('senderId', 'username email role')
            .populate('receiverId', 'username email role');

        res.json(populatedConnection);
    } catch (error) {
        console.error('Error rejecting connection:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};
