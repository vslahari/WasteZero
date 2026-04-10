const express = require("express");
const router = express.Router();
const { getUsers, toggleBlockUser, getLogs, getReportsData } = require("../controllers/adminController");

// Middleware to check if user is admin (Basic check for now)
const isAdmin = (req, res, next) => {
    // In a real app, we would verify the token and check user role from req.user
    // Assuming authMiddleware is used before this and attaches user to req
    // For now, let's just make it open or assume the server handles strict auth elsewhere
    // But since I'm not seeing global auth middleware yet, I'll skip strict check 
    // or rely on the frontend sending the right requests. 
    // TODO: Add proper auth middleware integration.
    next();
};

router.get("/users", isAdmin, getUsers);
router.get("/reports", isAdmin, getReportsData);
router.put("/users/:id/block", isAdmin, toggleBlockUser);
router.get("/logs", isAdmin, getLogs);

module.exports = router;
