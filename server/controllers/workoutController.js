const Workout = require('../models/workoutModel');

const createError = (message, statusCode) => {
  const err = new Error(message);
  err.statusCode = statusCode;
  return err;
};

// GET all workouts
const getWorkouts = async (req, res, next) => {
  try {
    const user_id = req.user._id;
    const workouts = await Workout.find({ user_id }).sort({ createdAt: -1 });
    res.status(200).json(workouts);
  } catch (error) {
    error.statusCode = error.statusCode || 500;
    next(error);
  }
};

// GET a single workout
const getWorkout = async (req, res, next) => {
  const { id } = req.params;

  try {
    const user_id = req.user._id;
    const workout = await Workout.findOne({ _id: id, user_id });

    if (!workout) {
      throw createError("Workout not found", 404);
    }

    res.status(200).json(workout);

  } catch (error) {
    error.statusCode = error.statusCode || 500;
    next(error);
  }
};

// POST a new workout
const createWorkout = async (req, res, next) => {
  try {
    const user_id = req.user._id;
    const { category, title, load, reps } = req.body;

    let emptyFields = [];

    if (!category || category.trim() === "") {
      emptyFields.push("category");
    }

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
      const error = createError(`Missing required fields: ${emptyFields.join(", ")}`, 400);
      error.emptyFields = emptyFields;
      throw error;
    }

    if (!Number.isFinite(load) || !Number.isFinite(reps)) {
      throw createError("Load and reps must be numbers", 400);
    }

    if (load <= 0 || reps <= 0) {
      throw createError("Load and reps must be positive numbers", 400);
    }

    const workout = await Workout.create({ category, title, load, reps, user_id });
    res.status(201).json(workout);
  } catch (error) {
    error.statusCode = error.statusCode || 500;
    next(error);
  }
};

// UPDATE a workout
const updateWorkout = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { category, title, load, reps } = req.body;
    const user_id = req.user._id;

    if (category !== undefined &&
      (typeof category === "string" && category.trim() === "")) {
      throw createError("Category cannot be empty", 400);
    }

    if (title !== undefined && title.trim() === "") {
      throw createError("Title cannot be empty", 400);
    }
    if (load !== undefined && !Number.isFinite(load)) {
      throw createError("Load must be a number", 400);
    }
    if (reps !== undefined && !Number.isFinite(reps)) {
      throw createError("Reps must be a number", 400);
    }
    if (load !== undefined && load <= 0) {
      throw createError("Load must be a positive number", 400);
    }
    if (reps !== undefined && reps <= 0) {
      throw createError("Reps must be a positive number", 400);
    }

    const updateFields = {};
    if (category !== undefined) updateFields.category = category;
    if (title !== undefined) updateFields.title = title;
    if (load !== undefined) updateFields.load = load;
    if (reps !== undefined) updateFields.reps = reps;

    const workout = await Workout.findOneAndUpdate(
      { _id: id, user_id },
      updateFields,
      { new: true, runValidators: true }
    );

    if (!workout) {
      throw createError("Workout not found", 404);
    }

    res.status(200).json(workout);
  } catch (error) {
    error.statusCode = error.statusCode || 500;
    next(error);
  }
};

// DELETE a workout
const deleteWorkout = async (req, res, next) => {
  const user_id = req.user._id;
  const { id } = req.params;

  try {
    const workout = await Workout.findOneAndDelete({ _id: id, user_id });

    if (!workout) {
      throw createError("Workout not found", 404);
    }

    res.status(200).json(workout);
  } catch (error) {
    error.statusCode = error.statusCode || 500;
    next(error);
  }
};

module.exports = {
  getWorkouts,
  getWorkout,
  createWorkout,
  updateWorkout,
  deleteWorkout
};