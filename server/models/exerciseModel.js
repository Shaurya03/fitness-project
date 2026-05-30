const mongoose = require("mongoose");

const exerciseSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },

  type: {
    type: String,
    enum: ["strength", "cardio"],
    required: true
  },

  category: {
    type: String,
    default: null
  },

  user_id: {
    type: String,
    default: null
  },

  isDefault: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

module.exports = mongoose.model("Exercise", exerciseSchema);