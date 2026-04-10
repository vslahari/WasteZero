const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true
    },
    role: {
      type: String,
      required: true,
      enum: ["volunteer", "NGO", "admin"]
    },
    mobile: {
      type: String,
      required: true
    },
    location: {
      type: String,
      required: true
    },
    bio: {
      type: String,
      default: ""
    },
    skills: {
      type: [String],
      default: []
    },
    availability: {
      type: String,
      default: ""
    },
    email: {
      type: String,
      required: true,
      unique: true
    },
    password: {
      type: String,
      required: true
    },
    otp: {
      type: String,
      default: null
    },
    otpExpires: {
      type: Date,
      default: null
    },
    status: {
      type: String,
      default: "Active",
      enum: ["Active", "Blocked"]
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
