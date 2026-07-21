const mongoose = require("mongoose");

const settingsSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    unique: true
  },

  theme: {
    type: String,
    enum: ["light", "dark"],
    default: "dark"
  },

  weightSystem: {
    type: String,
    enum: ["metric", "imperial"],
    default: "metric"
  },

  distanceSystem: {
    type: String,
    enum: ["metric", "imperial"],
    default: "metric"
  }
},
  {
    timestamps: true
  }
);

module.exports = mongoose.model(
  "Settings",
  settingsSchema
);