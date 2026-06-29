const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const setSchema = new Schema({
  metrics: {
    type: Map,
    of: Number,
    default: {}
  },

  inputUnits: {
    type: Map,
    of: String,
    default: {}
  }
});

const exerciseSchema = new Schema(
  {
    categoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true
    },

    exerciseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Exercise",
      required: true
    },
    
    sets: {
      type: [setSchema],
      default: []
    }
  }
);

const workoutSchema = new Schema(
  {
    title: {
      type: String,
      trim: true,
      default: "",
    },

    date: {
      type: Date,
      default: Date.now
    },

    exercises: {
      type: [exerciseSchema],
      required: true,
    },
    
    user_id: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Workout", workoutSchema);