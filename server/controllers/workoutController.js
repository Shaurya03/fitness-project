const Workout = require('../models/WorkoutModel');

// GET all workouts
const getWorkouts = async (req, res) => {
  try {
    const workouts = await Workout.find({}).sort({ createdAt: -1 });
    res.status(200).json(workouts);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// GET a single workout
const getWorkout = async (req, res) => {
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
};

// POST a new workout
const createWorkout = async (req, res) => {
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

  if (load <= 0 || reps <= 0) {
    return res.status(400).json({ error: "Load and reps must be positive numbers" });
  }

  try {
    const workout = await Workout.create({ title, load, reps });
    res.status(201).json(workout);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// UPDATE a workout
const updateWorkout = async (req, res) => {
  const { id } = req.params;
  const { title, load, reps } = req.body;

  if (title !== undefined && title.trim() === "") {
    return res.status(400).json({ error: "Title cannot be empty" });
  }
  if (load !== undefined && !Number.isFinite(load)) {
    return res.status(400).json({ error: "Load must be a number" });
  }
  if (reps !== undefined && !Number.isFinite(reps)) {
    return res.status(400).json({ error: "Reps must be a number" });
  }
  if (load !== undefined && load <= 0) {
    return res.status(400).json({ error: "Load must be a positive number" });
  }
  if (reps !== undefined && reps <= 0) {
    return res.status(400).json({ error: "Reps must be a positive number" });
  }

  const updateFields = {};
  if (title !== undefined) updateFields.title = title;
  if (load !== undefined) updateFields.load = load;
  if (reps !== undefined) updateFields.reps = reps;

  try {
    const workout = await Workout.findByIdAndUpdate(
      id,
      updateFields,
      { new: true }
    );

    if (!workout) {
      return res.status(404).json({ error: "Workout not found" });
    }

    res.status(200).json(workout);
  } catch (error) {
    res.status(400).json({ error: "Invalid workout ID" });
  }
};

// DELETE a workout
const deleteWorkout = async (req, res) => {
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
};

module.exports = {
  getWorkouts,
  getWorkout,
  createWorkout,
  updateWorkout,
  deleteWorkout
};