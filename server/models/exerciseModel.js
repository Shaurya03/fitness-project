const mongoose = require("mongoose");
const METRICS = require("../utils/metrics");

const exerciseSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },

  categoryId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category",
    required: true
  },

  metrics: {
    type: [String],
    enum: METRICS,
    default: []
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