
// Apply for an opportunity
const applyForOpportunity = async (req, res) => {
    try {
        const opportunity = await Opportunity.findById(req.params.id);

        if (!opportunity) {
            return res.status(404).json({ message: "Opportunity not found" });
        }

        // Check if already applied
        const alreadyApplied = opportunity.applications.find(
            app => app.volunteer.toString() === req.user.id
        );

        if (alreadyApplied) {
            return res.status(400).json({ message: "You have already applied for this opportunity" });
        }

        opportunity.applications.push({
            volunteer: req.user.id,
            status: 'pending'
        });

        await opportunity.save();
        res.json({ message: "Application submitted successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Update application status (for NGO)
const updateApplicationStatus = async (req, res) => {
    try {
        const { status, volunteerId } = req.body;
        const opportunity = await Opportunity.findById(req.params.id);

        if (!opportunity) {
            return res.status(404).json({ message: "Opportunity not found" });
        }

        // Check ownership
        if (opportunity.createdBy.toString() !== req.user.id) {
            return res.status(403).json({ message: "Not authorized" });
        }

        const application = opportunity.applications.find(
            app => app.volunteer.toString() === volunteerId
        );

        if (!application) {
            return res.status(404).json({ message: "Application not found" });
        }

        application.status = status;
        await opportunity.save();

        res.json({ message: `Application ${status} successfully` });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
