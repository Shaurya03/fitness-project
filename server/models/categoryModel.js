const mongoose = require("mongoose");
const METRICS = require("../utils/metrics");

const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },

  defaultMetrics: {
    type: [String],
    enum: METRICS,
    default: []
  },

  user_id: {
    type: String,
    required: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model("Category", categorySchema);