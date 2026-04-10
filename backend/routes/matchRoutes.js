const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const { getMatches } = require("../controllers/matchController");

// @route   GET /api/match/:userId
// @desc    Get matched opportunities for a user
// @access  Protected
router.get("/:userId", protect, getMatches);

module.exports = router;
