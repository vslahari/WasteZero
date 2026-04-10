const User = require("../models/User");

// Get User Profile
exports.getUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select("-password -otp -otpExpires");
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Update User Profile
exports.updateUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const { name, mobile, location, bio, skills, availability } = req.body;
        // Frontend sends 'name', 'location', 'contact' (mobile), 'bio', 'skills', 'availability'
        // User model has 'username', 'mobile', 'location', 'bio', 'skills', 'availability'

        if (name) user.username = name;
        if (mobile || req.body.contact) user.mobile = mobile || req.body.contact;
        if (location) user.location = location;
        if (bio !== undefined) user.bio = bio; // Allow empty string

        // Update skills and availability for volunteers
        if (user.role === 'volunteer') {
            if (skills !== undefined) user.skills = skills;
            if (availability !== undefined) user.availability = availability;
        }

        const updatedUser = await user.save();

        res.json({
            _id: updatedUser._id,
            username: updatedUser.username,
            email: updatedUser.email,
            role: updatedUser.role,
            mobile: updatedUser.mobile,
            location: updatedUser.location,
            bio: updatedUser.bio,
            skills: updatedUser.skills,
            availability: updatedUser.availability
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get All Users (for network page)
exports.getAllUsers = async (req, res) => {
    try {
        const currentUserId = req.query.currentUserId;

        // Get all users except the current user, excluding sensitive fields
        const users = await User.find({
            _id: { $ne: currentUserId }
        }).select('username email role location skills availability');

        res.json(users);
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({ message: error.message });
    }
};
