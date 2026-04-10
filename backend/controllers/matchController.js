const User = require("../models/User");
const Opportunity = require("../models/Opportunity");

exports.getMatches = async (req, res) => {
    try {

        const userId = req.params.userId;

        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        console.log("USER RAW SKILLS:", user.skills);
        console.log("USER LOCATION:", user.location);

        // ===== NORMALIZE USER SKILLS =====
        let userSkills = [];

        if (typeof user.skills === "string") {
            userSkills = user.skills.split(",").map(s => s.trim());
        }
        else if (Array.isArray(user.skills)) {
            userSkills = user.skills;
        }

        const opportunities = await Opportunity.find({});

        let results = [];

        opportunities.forEach(op => {

            // ===== SKIP IF USER ALREADY APPLIED =====
            const alreadyApplied = op.applications?.some(app =>
                app.volunteer?.toString() === userId.toString()
            );

            if (alreadyApplied) {
                return;   // don't recommend applied events
            }

            let score = 0;

            // ===== NORMALIZE OP SKILLS =====
            let opSkillsArray = [];

            if (typeof op.skills === "string") {
                opSkillsArray = op.skills.split(",").map(s => s.trim());
            }
            else if (Array.isArray(op.skills)) {
                opSkillsArray = op.skills;
            }

            console.log("USER SKILLS:", userSkills);
            console.log("OP SKILLS:", opSkillsArray);

            // ===== MATCH SKILLS =====
            const common = userSkills.filter(us =>
                opSkillsArray.some(os =>
                    os.toLowerCase() === us.toLowerCase()
                )
            );

            score += common.length * 50;

            // ===== MATCH LOCATION =====
            console.log("USER LOC:", user.location);
            console.log("OP LOC:", op.location);

            // ----- STRICT RULES -----

            // 1. LOCATION MUST MATCH
            if (
                !user.location ||
                !op.location ||
                user.location.toLowerCase() !== op.location.toLowerCase()
            ) {
                return;     // SKIP THIS EVENT COMPLETELY
            }

            // 2. AT LEAST ONE SKILL MUST MATCH
            if (common.length === 0) {
                return;     // SKIP
            }

            // 3. ONLY THEN CALCULATE SCORE
            score = common.length * 50 + 30;

            results.push({
                opportunity: op,
                matchScore: score
            });

        });

        results.sort((a, b) => b.matchScore - a.matchScore);

        res.json(results);

    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
