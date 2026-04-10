const Opportunity = require("../models/Opportunity");
const User = require("../models/User");
const Notification = require("../models/Notification");
// const Application = require("../models/Application"); // Assuming Application model might not be needed if embedded, but checking imports from source


// Create new opportunity
const createOpportunity = async (req, res) => {
  try {
    const { title, description, skills, duration, location, date } = req.body;

    const opportunity = new Opportunity({
      title,
      description,
      skills,
      duration,
      location,
      date,
      createdBy: req.user.id
    });

    await opportunity.save();

    // Smart Matching Algorithm: Match by location AND skills
    // const skillsArray = skills ? skills.split(',').map(s => s.trim().toLowerCase()) : [];
    const skillsArray = Array.isArray(skills)
      ? skills.map(s => s.trim().toLowerCase())
      : (skills ? skills.split(',').map(s => s.trim().toLowerCase()) : []);

    const matchQuery = {
      role: "volunteer",
      location: location
    };

    // If skills specified, match volunteers with those skills
    if (skillsArray.length > 0) {
      matchQuery.skills = { $in: skillsArray };
    }

    const matchedVolunteers = await User.find(matchQuery);

    // Get Socket.IO instance
    const io = req.app.get('io');

    // Send notifications to matched volunteers
    for (const volunteer of matchedVolunteers) {
      const notification = await Notification.create({
        userId: volunteer._id,
        type: "match",
        message: `New opportunity "${title}" matches your profile!`,
        data: {
          opportunityId: opportunity._id,
          ngoId: req.user.id,
          action: 'match'
        }
      });

      // Emit real-time notification
      if (io) {
        io.to(volunteer._id.toString()).emit("new_notification", {
          ...notification.toObject(),
          opportunity
        });
      }
    }

    res.status(201).json(opportunity);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all opportunities
const getOpportunities = async (req, res) => {
  try {
    const opportunities = await Opportunity.find()
      .populate("createdBy", "username email")
      .populate("applications.volunteer", "username email mobile location") // Populate volunteer details
      .sort({ createdAt: -1 });
    res.json(opportunities);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get opportunity by ID
const getOpportunityById = async (req, res) => {
  try {
    const opportunity = await Opportunity.findById(req.params.id)
      .populate("createdBy", "username email")
      .populate("applications.volunteer", "username email mobile location"); // Populate volunteer details

    if (!opportunity) {
      return res.status(404).json({ message: "Opportunity not found" });
    }

    res.json(opportunity);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update opportunity
const updateOpportunity = async (req, res) => {
  try {
    const { title, description, skills, duration, location, date } = req.body;

    const opportunity = await Opportunity.findById(req.params.id);

    if (!opportunity) {
      return res.status(404).json({ message: "Opportunity not found" });
    }

    // Check if user owns this opportunity
    if (opportunity.createdBy.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized" });
    }

    const updatedOpportunity = await Opportunity.findByIdAndUpdate(
      req.params.id,
      { title, description, skills, duration, location, date },
      { new: true }
    ).populate("createdBy", "username email");

    res.json(updatedOpportunity);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete opportunity
const deleteOpportunity = async (req, res) => {
  try {
    const opportunity = await Opportunity.findById(req.params.id);

    if (!opportunity) {
      return res.status(404).json({ message: "Opportunity not found" });
    }

    // Check if user owns this opportunity OR is an admin
    if (opportunity.createdBy.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: "Not authorized" });
    }

    await Opportunity.findByIdAndDelete(req.params.id);
    res.json({ message: "Opportunity deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

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

    // Create notification for NGO about new application
    const ngoNotification = await Notification.create({
      userId: opportunity.createdBy._id,
      type: "application",
      message: `${req.user.username} applied for "${opportunity.title}"`,
      data: {
        opportunityId: opportunity._id,
        volunteerId: req.user.id,
        action: 'created'
      }
    });

    // Emit real-time notification to NGO
    const io = req.app.get('io');
    if (io) {
      io.to(opportunity.createdBy._id.toString()).emit("new_application", {
        ...ngoNotification.toObject(),
        volunteer: req.user,
        opportunity
      });
    }

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

    // Get volunteer details (req.user is NGO)
    // We need to fetch volunteer info to send notification
    // The volunteerId is passed in req.body

    // Create notification for volunteer about status change
    const volunteerNotification = await Notification.create({
      userId: volunteerId,
      type: status === 'accepted' ? "approval" : "rejection",
      message: `Your application for "${opportunity.title}" was ${status}`,
      data: {
        opportunityId: opportunity._id,
        ngoId: req.user.id,
        action: status
      }
    });

    // Emit real-time notification to volunteer
    const io = req.app.get('io');
    if (io) {
      io.to(volunteerId.toString()).emit("application_status_update", {
        ...volunteerNotification.toObject(),
        opportunity,
        status
      });
    }

    res.json({ message: `Application ${status} successfully` });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Find matched volunteers for an opportunity (Match Suggestion Feature)
const findMatchedVolunteers = async (req, res) => {
  try {
    console.log("Finding matches for opportunity ID:", req.params.id);
    console.log("User ID:", req.user.id);

    const opportunity = await Opportunity.findById(req.params.id);

    if (!opportunity) {
      console.log("Opportunity not found");
      return res.status(404).json({ message: "Opportunity not found" });
    }

    console.log("Opportunity found:", opportunity.title);
    console.log("Opportunity createdBy:", opportunity.createdBy);
    console.log("Opportunity skills:", opportunity.skills);
    console.log("Opportunity location:", opportunity.location);

    // Check ownership
    if (opportunity.createdBy.toString() !== req.user.id) {
      console.log("Authorization failed - not the owner");
      return res.status(403).json({ message: "Not authorized" });
    }

    // Get all volunteers
    const volunteers = await User.find({ role: "volunteer" }).select(
      'username email location skills availability'
    );

    console.log(`\n===== FIND MATCHES DEBUG =====`);
    console.log(`Opportunity: "${opportunity.title}"`);
    console.log(`Opportunity location: "${opportunity.location}"`);
    console.log(`Opportunity skills (raw): ${JSON.stringify(opportunity.skills)}`);
    console.log(`Total volunteers found: ${volunteers.length}`);
    volunteers.forEach(v => {
      console.log(`  Volunteer: ${v.username} | location: "${v.location}" | skills: ${JSON.stringify(v.skills)}`);
    });
    console.log(`==============================\n`);

    // Scoring algorithm
    const scoredVolunteers = volunteers.map(volunteer => {
      let score = 0;
      const breakdown = {
        location: 0,
        skills: 0,
        availability: 0
      };

      // Location match (30 points)
      if (volunteer.location && opportunity.location) {
        if (volunteer.location.toLowerCase() === opportunity.location.toLowerCase()) {
          score += 30;
          breakdown.location = 30;
        } else if (
          volunteer.location.toLowerCase().includes(opportunity.location.toLowerCase()) ||
          opportunity.location.toLowerCase().includes(volunteer.location.toLowerCase())
        ) {
          score += 15;
          breakdown.location = 15;
        }
      }

      // Skills match (50 points)
      // If opportunity has no skills specified, give all volunteers full skill score
      if (!opportunity.skills || opportunity.skills.length === 0) {
        score += 50;
        breakdown.skills = 50;
        console.log(`  [${volunteer.username}] No opp skills set → full skill score 50`);
      } else if (volunteer.skills && volunteer.skills.length > 0) {
        const volunteerSkills = volunteer.skills.map(s => s.toLowerCase());
        const opportunitySkills = Array.isArray(opportunity.skills)
          ? opportunity.skills.map(s => s.toLowerCase())
          : opportunity.skills.split(',').map(s => s.trim().toLowerCase());

        const matchingSkills = volunteerSkills.filter(skill =>
          opportunitySkills.some(oppSkill => oppSkill.includes(skill) || skill.includes(oppSkill))
        );

        console.log(`  [${volunteer.username}] volSkills: ${JSON.stringify(volunteerSkills)}`);
        console.log(`  [${volunteer.username}] oppSkills: ${JSON.stringify(opportunitySkills)}`);
        console.log(`  [${volunteer.username}] matched:   ${JSON.stringify(matchingSkills)}`);

        if (matchingSkills.length > 0) {
          const skillScore = Math.min(50, (matchingSkills.length / opportunitySkills.length) * 50);
          score += skillScore;
          breakdown.skills = Math.round(skillScore);
        }
      } else {
        console.log(`  [${volunteer.username}] has EMPTY skills array in DB → 0 skill score`);
      }

      // Availability match (20 points)
      if (volunteer.availability && opportunity.date) {
        const opportunityDate = new Date(opportunity.date);
        const availabilityArray = Array.isArray(volunteer.availability)
          ? volunteer.availability
          : [volunteer.availability];

        const isAvailable = availabilityArray.some(avail => {
          if (typeof avail === 'string' && avail.trim() !== '') {
            const availDate = new Date(avail);
            if (!isNaN(availDate)) {
              const timeDiff = Math.abs(availDate - opportunityDate);
              const daysDiff = timeDiff / (1000 * 60 * 60 * 24);
              return daysDiff <= 30; // Within a month (relaxed from 7 days)
            }
          }
          return false;
        });

        if (isAvailable) {
          score += 20;
          breakdown.availability = 20;
        }
      }

      return {
        volunteer: {
          _id: volunteer._id,
          username: volunteer.username,
          email: volunteer.email,
          location: volunteer.location,
          skills: volunteer.skills,
          availability: volunteer.availability
        },
        score: Math.round(score),
        breakdown
      };
    });

    // Sort by score (highest first) - show ALL volunteers, sorted by relevance
    const matches = scoredVolunteers
      .sort((a, b) => b.score - a.score);

    console.log(`Found ${matches.length} matches with score > 0`);
    res.json({ matches });
  } catch (error) {
    console.error('Error finding matches:', error);
    res.status(500).json({ message: error.message });
  }
};

// GET /api/opportunities/co-partners
// Returns all unique users who share an event with the logged-in user
const getCoPartners = async (req, res) => {
  try {
    const myId = req.user.id;

    // Find events where I am the creator (NGO) OR an accepted volunteer
    const myEvents = await Opportunity.find({
      $or: [
        { createdBy: myId },
        { applications: { $elemMatch: { volunteer: myId, status: 'accepted' } } }
      ]
    })
      .populate('createdBy', 'username role email')
      .populate('applications.volunteer', 'username role email');

    // Build a unique map of co-partners (userId -> { user, events[] })
    const partnerMap = new Map();

    for (const event of myEvents) {
      const eventLabel = event.title;
      const myIdStr = String(myId);

      // Helper to add a partner to the map
      const addPartner = (user) => {
        if (!user || String(user._id) === myIdStr) return;
        const uid = String(user._id);
        if (!partnerMap.has(uid)) {
          partnerMap.set(uid, {
            _id: user._id,
            username: user.username,
            role: user.role,
            events: []
          });
        }
        const existing = partnerMap.get(uid);
        if (!existing.events.includes(eventLabel)) {
          existing.events.push(eventLabel);
        }
      };

      // Add the NGO creator
      addPartner(event.createdBy);

      // Add all ACCEPTED volunteers
      for (const app of event.applications) {
        if (app.status === 'accepted') {
          addPartner(app.volunteer);
        }
      }
    }

    res.json(Array.from(partnerMap.values()));
  } catch (err) {
    res.status(500).json({ message: 'Error fetching co-partners', error: err.message });
  }
};

module.exports = {
  createOpportunity,
  getOpportunities,
  getOpportunityById,
  updateOpportunity,
  deleteOpportunity,
  applyForOpportunity,
  updateApplicationStatus,
  findMatchedVolunteers,
  getCoPartners
};