const Workout = require('../models/workoutModel');

const createError = (message, statusCode) => {
  const err = new Error(message);
  err.statusCode = statusCode;
  return err;
};

const validateExercises = (exercises) => {
  for (const exercise of exercises) {

    if (
      !exercise.name ||
      !exercise.category ||
      exercise.sets === undefined ||
      exercise.load === undefined ||
      exercise.reps === undefined
    ) {
      throw createError(
        "All exercise fields are required",
        400
      );
    }

    if (
      exercise.sets <= 0 ||
      exercise.load <= 0 ||
      exercise.reps <= 0
    ) {
      throw createError(
        "Sets, load and reps must be positive numbers",
        400
      );
    }
  }
}

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
    const { title, exercises } = req.body;

    let emptyFields = [];

    if (!title || title.trim() === "") {
      emptyFields.push("title");
    }

    if (!Array.isArray(exercises)) {
      throw createError(
        "Exercises must be an array",
        400
      );
    }

    if (exercises.length === 0) {
      throw createError(
        "At least one exercise is required",
        400
      );
    }

    if (emptyFields.length > 0) {
      const error = createError(
        `Missing required fields: ${emptyFields.join(", ")}`,
        400
      );
      error.emptyFields = emptyFields;
      throw error;
    }

    validateExercises(exercises);

    const workout = await Workout.create({
      title,
      exercises,
      user_id
    });
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
    const { title, exercises } = req.body;
    const user_id = req.user._id;

    if (title !== undefined && title.trim() === "") {
      throw createError(
        "Title cannot be empty",
        400
      );
    }

    if (!Array.isArray(exercises)) {
      throw createError(
        "Exercises must be an array",
        400
      );
    }

    if (exercises.length === 0) {
      throw createError(
        "At least one exercise is required",
        400
      );
    }

    validateExercises(exercises);

    const updateFields = {};
    if (title !== undefined) updateFields.title = title;
    if (exercises !== undefined) updateFields.exercises = exercises;

    const workout = await Workout.findOneAndUpdate(
      { _id: id, user_id },
      updateFields,
      { new: true, runValidators: true }
    );

    if (!workout) {
      throw createError(
        "Workout not found",
        404
      );
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
      throw createError(
        "Workout not found",
        404
      );
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