const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const setSchema = new Schema(
  {
    load: {
      type: Number,
      required: true
    },
    reps: {
      type: Number,
      required: true
    }
  }
);

const exerciseSchema = new Schema(
  {
    name: {
      type: String,
      required: true
    },
    category: {
      type: String,
      required: true
    },
    sets: {
      type: [setSchema],
      required: true
    }
  }
);

const workoutSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
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