const express = require("express");
const router = express.Router();

const mongoose = require("mongoose");

const validateObjectId = (req, res, next) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ error: "Invalid workout ID" });
  }
  next();
};

// GET all workouts
const Workout = require("../models/workoutModel");

router.get("/", async (req, res) => {
  try {
    const workouts = await Workout.find({}).sort({ createdAt: -1 });
    res.status(200).json(workouts);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// POST workout
router.post("/", async (req, res) => {
  const { title, load, reps } = req.body;

  let emptyFields = [];

  if (!title || title.trim() === "") {
    emptyFields.push("title");
  }
  if (load === undefined) {
    emptyFields.push("load");
  }
  if (reps === undefined) {
    emptyFields.push("reps");
  }

  if (emptyFields.length > 0) {
    return res.status(400).json({ error: "Please fill in all fields", emptyFields });
  }

  if (!Number.isFinite(load) || !Number.isFinite(reps)) {
    return res.status(400).json({ error: "Load and reps must be numbers" });
  }

  if(load <= 0 || reps <= 0) {
    return res.status(400).json({ error: "Load and reps must be positive numbers" });
  }

  try {
    const workout = await Workout.create({ title, load, reps });
    res.status(201).json(workout);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// GET a single workout
router.get("/:id", validateObjectId, async (req, res) => {
  const { id } = req.params;

  try {
    const workout = await Workout.findById(id);
  
    if (!workout) {
      return res.status(404).json({ error: "Workout not found" });
    }

    res.status(200).json(workout);
  } catch (error) {
    res.status(400).json({ error: "Invalid workout ID" });
  }
});

// UPDATE a workout
router.patch("/:id", validateObjectId, async (req, res) => {
  const { id } = req.params;
  
  try {
    const workout = await Workout.findByIdAndUpdate(
      id,
      { ...req.body },
      { new: true }
    );

    if (!workout) {
      return res.status(404).json({ error: "Workout not found" });
    }

    res.status(200).json(workout);
  } catch (error) {
    res.status(400).json({ error: "Invalid workout ID" });
  }
});

// DELETE a workout
router.delete("/:id", validateObjectId, async (req, res) => {
  const { id } = req.params;

  try {
    const workout = await Workout.findByIdAndDelete(id);

    if (!workout) {
      return res.status(404).json({ error: "Workout not found" });
    }

    res.status(200).json({ message: "Workout deleted successfully" });
  } catch (error) {
    res.status(400).json({ error: "Invalid workout ID" });
  }
});

module.exports = router;