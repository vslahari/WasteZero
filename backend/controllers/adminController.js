const User = require("../models/User");
const AdminLog = require("../models/AdminLog");
const bcrypt = require("bcryptjs");

// Get all users
exports.getUsers = async (req, res) => {
    try {
        const users = await User.find({ role: { $ne: 'admin' } }).select("-password");
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Block/Unblock user
exports.toggleBlockUser = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body; // 'Active' or 'Blocked'

        const user = await User.findById(id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Since our User model doesn't strictly have a 'status' field in the schema provided earlier,
        // we might need to add it or just assume we are simulating it.
        // However, looking at the Frontend code, it expects a 'status'.
        // Let's assume we can add a 'status' field to the user model or check if we missed it.
        // Wait, the User model I viewed earlier did NOT have a status field.
        // I should probably add it to the User model as well.
        // For now, I will assume we are adding a 'isBlocked' boolean or 'status' string.
        // Let's stick to 'status' as per frontend.

        // Actually, let's verify if I should update User schema first.
        // The previous User schema view didn't show 'status'.
        // I will add 'status' to User schema in a separate step or just use it here dynamically 
        // (Mongoose allows flexible schemas if strict is false, but better to define it).

        user.status = status;
        await user.save();

        // Log the action
        await AdminLog.create({
            action: `${status === 'Blocked' ? 'Blocked' : 'Unblocked'} User`,
            user_id: id,
            details: `User ${user.username} was ${status.toLowerCase()}`
        });

        res.json({ message: `User ${status.toLowerCase()} successfully`, user });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get Admin Logs
exports.getLogs = async (req, res) => {
    try {
        const logs = await AdminLog.find().populate("user_id", "username email").sort({ timestamp: -1 });
        res.json(logs);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const Opportunity = require("../models/Opportunity");

// Get Reports Data
exports.getReportsData = async (req, res) => {
    try {
        const users = await User.find({ role: { $ne: 'admin' } }).select("-password");
        const opportunities = await Opportunity.find();

        // Aggregate applications from opportunities
        let applications = [];
        opportunities.forEach(opp => {
            if (opp.applications && opp.applications.length > 0) {
                opp.applications.forEach(app => {
                    // Need to resolve volunteer name if possible, but here we might just have ID if not populated.
                    // For better performance, we should populate.
                    // Let's assume we can re-query or populate in the find().
                    // For simplicity in this step, let's just push what we have or do a better query below.
                });
            }
        });

        // Better approach: fetch opportunities WITH populated applications
        const opportunitiesPopulated = await Opportunity.find()
            .populate('applications.volunteer', 'username email')
            .populate('createdBy', 'username');

        applications = [];
        opportunitiesPopulated.forEach(opp => {
            if (opp.applications) {
                opp.applications.forEach(app => {
                    applications.push({
                        volunteer: app.volunteer ? app.volunteer.username : 'Unknown',
                        opportunity: opp.title,
                        status: app.status,
                        appliedAt: app.appliedAt
                    });
                });
            }
        });

        const reportData = {
            counts: {
                users: users.length,
                opportunities: opportunities.length,
                applications: applications.length
            },
            users: users,
            opportunities: opportunitiesPopulated.map(o => ({
                title: o.title,
                location: o.location,
                status: new Date(o.date) > new Date() ? 'Open' : 'Closed',
                date: o.date
            })),
            applications: applications
        };

        res.json(reportData);
    } catch (error) {
        console.error("Error fetching reports:", error);
        res.status(500).json({ message: error.message });
    }
};

// Seed Admin User (Function to be called on server start)
exports.seedAdmin = async () => {
    try {
        const adminEmail = "admin@123"; // Using this as email based on user request "user:admin password:admin@123" 
        // Wait, user said "user:admin password: admin@123". 
        // The login form uses 'emailOrUsername'. 
        // So I can set username="admin", email="admin@wastezero.com" (dummy), password="admin@123".

        const existingAdmin = await User.findOne({ username: "admin" });
        if (!existingAdmin) {
            const hashedPassword = await bcrypt.hash("admin@123", 10);
            await User.create({
                username: "admin",
                email: "admin@wastezero.com", // Dummy email
                password: hashedPassword,
                role: "admin",
                mobile: "0000000000",
                location: "Headquarters",
                status: "Active" // Adding status here
            });
            console.log("Admin user created: admin / admin@123");
        }
    } catch (error) {
        console.error("Error seeding admin:", error);
    }
};
