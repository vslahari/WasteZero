const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const {
    getConnections,
    getConnectionStatus,
    sendConnectionRequest,
    acceptConnectionRequest,
    rejectConnectionRequest
} = require('../controllers/connectionController');

// @route   GET /api/connections
// @desc    Get user's accepted connections
// @access  Protected
router.get('/', protect, getConnections);

// @route   GET /api/connections/status
// @desc    Get all connection statuses for user
// @access  Protected
router.get('/status', protect, getConnectionStatus);

// @route   POST /api/connections/request
// @desc    Send connection request
// @access  Protected
router.post('/request', protect, sendConnectionRequest);

// @route   POST /api/connections/accept
// @desc    Accept connection request
// @access  Protected
router.post('/accept', protect, acceptConnectionRequest);

// @route   POST /api/connections/reject
// @desc    Reject connection request
// @access  Protected
router.post('/reject', protect, rejectConnectionRequest);

module.exports = router;
