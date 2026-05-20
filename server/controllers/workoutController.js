const Workout = require('../models/workoutModel');

const createError = (message, statusCode) => {
  const err = new Error(message);
  err.statusCode = statusCode;
  return err;
};

const isPositiveNumber = (value) => {
  return (
    typeof value === "number" &&
    Number.isFinite(value) &&
    value > 0
  );
};

const isPositiveInteger = (value) => {
  return (
    Number.isInteger(value) &&
    value > 0
  );
};

const validateSets = (sets) => {
  if (!Array.isArray(sets)) {
    throw createError(
      "Sets must be an array",
      400
    );
  }

  if (sets.length === 0) {
    throw createError(
      "At least one set is required",
      400
    );
  }

  for (const set of sets) {

    if (
      set.load === undefined ||
      set.reps === undefined
    ) {
      throw createError(
        "Set load and reps are required",
        400
      );
    }

    if (!isPositiveNumber(set.load)) {
      throw createError(
        "Set load must be a positive number",
        400
      );
    }

    if (!isPositiveInteger(set.reps)) {
      throw createError(
        "Set reps must be a positive integer",
        400
      );
    }
  }
};

const validateCardio = (exercise) => {

  if (
    exercise.duration === undefined ||
    exercise.distance === undefined
  ) {
    throw createError(
      "Cardio exercises require duration and distance",
      400
    );
  }

  if (!isPositiveNumber(exercise.duration)) {
    throw createError(
      "Duration must be a positive number",
      400
    );
  }

  if (!isPositiveNumber(exercise.distance)) {
    throw createError(
      "Distance must be a positive number",
      400
    );
  }
};

const validateExercises = (exercises) => {

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

  for (const exercise of exercises) {

    if (
      !exercise.name ||
      !exercise.name.trim()
    ) {
      throw createError(
        "Exercise name is required",
        400
      );
    }

    if (exercise.type === "strength") {

      if (
        !exercise.category ||
        !exercise.category.trim()
      ) {
        throw createError(
          "Exercise category is required",
          400
        );
      }
    }

    if (
      !exercise.type ||
      !["strength", "cardio"].includes(exercise.type)
    ) {
      throw createError(
        "Exercise type must be strength or cardio",
        400
      );
    }

    if (exercise.type === "strength") {
      validateSets(exercise.sets);
    }

    if (exercise.type === "cardio") {
      validateCardio(exercise);
    }
  }
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
    const { title, exercises } = req.body;

    let emptyFields = [];

    if (
      typeof title !== "string" ||
      !title.trim()
    ) {
      emptyFields.push("title");
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

    const sanitizedExercises = exercises.map((exercise) => ({
      ...exercise,
      name: exercise.name.trim(),
      category: exercise.category?.trim()
    }));

    const workout = await Workout.create({
      title: title.trim(),
      exercises: sanitizedExercises,
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

    if (
      title !== undefined &&
      (
        typeof title !== "string" ||
        !title.trim()
      )
    ) {
      throw createError(
        "Title cannot be empty",
        400
      );
    }

    if (exercises !== undefined) {
      validateExercises(exercises);
    }

    const updateFields = {};

    if (title !== undefined) {
      updateFields.title = title.trim();
    }

    if (exercises !== undefined) {
      updateFields.exercises = exercises.map((exercise) => ({
        ...exercise,
        name: exercise.name.trim(),
        category: exercise.category?.trim()
      }));
    }

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