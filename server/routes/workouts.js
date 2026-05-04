const express = require("express");
const router = express.Router();

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

  try {
    const workout = await Workout.create({ title, load, reps });
    res.status(201).json(workout);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// GET a single workout
router.get("/:id", async (req, res) => {
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
router.patch("/:id", async (req, res) => {
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

module.exports = router;