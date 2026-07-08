const Exercise = require("../models/exerciseModel");
const Category = require("../models/categoryModel");
const Workout = require("../models/workoutModel");

const getWorkoutCount = async (exerciseId, user_id) => {
  return Workout.countDocuments({
    user_id,
    "exercises.exerciseId": exerciseId
  });
};

const getExercises = async (req, res) => {
  const user_id = req.user._id;

  const exercises = await Exercise
    .find({
      user_id,
      isArchived: false
    })
    .populate("categoryId")
    .sort({ name: 1 });

  const exercisesWithCounts = await Promise.all(
    exercises.map(async (exercise) => ({
      ...exercise.toObject(),
      workoutCount: await getWorkoutCount(
        exercise._id,
        user_id
      )
    }))
  );

  res.status(200).json(exercisesWithCounts);
};

const createExercise = async (req, res) => {
  const {
    name,
    categoryId,
    metrics
  } = req.body;

  const user_id = req.user._id;

  const normalizedName = name.trim();

  if (!normalizedName) {
    return res.status(400).json({
      error: "Exercise name is required"
    });
  }

  if (!categoryId) {
    return res.status(400).json({
      error: "Category is required"
    });
  }

  const existingExercise = await Exercise.findOne({
    user_id,
    name: {
      $regex: `^${normalizedName}$`,
      $options: "i"
    }
  });

  if (existingExercise && !existingExercise.isArchived) {
    return res.status(400).json({
      error: "Exercise already exists"
    });
  }

  if (existingExercise?.isArchived && !req.body.restoreArchived) {
    return res.status(409).json({
      archivedExercise: true,
      exerciseName: normalizedName
    });
  }

  if (existingExercise?.isArchived && req.body.restoreArchived) {

    existingExercise.name = normalizedName;
    existingExercise.categoryId = categoryId;
    existingExercise.metrics = metrics;
    existingExercise.isArchived = false;

    await existingExercise.save();

    const populatedExercise = await Exercise
      .findById(existingExercise._id)
      .populate("categoryId");

    return res.status(200).json({
      ...populatedExercise.toObject(),
      workoutCount: await getWorkoutCount(
        existingExercise._id,
        user_id
      )
    });
  }

  const exercise = await Exercise.create({
    ...req.body,
    name: normalizedName,
    user_id
  });

  const populatedExercise = await Exercise
    .findById(exercise._id)
    .populate("categoryId");

  res.status(201).json({
    ...populatedExercise.toObject(),
    workoutCount: 0
  });
};

const updateExercise = async (req, res) => {
  const user_id = req.user._id;
  const { id } = req.params;

  const {
    name,
    metrics,
    categoryId
  } = req.body;

  const updates = {};

  if (categoryId !== undefined) {

    const category = await Category.findOne({
      _id: categoryId,
      user_id
    });

    if (!category) {
      return res.status(404).json({
        error: "Category not found"
      });
    }

    updates.categoryId = categoryId;
  }

  if (name !== undefined) {

    const normalizedName = name.trim();

    if (!normalizedName) {
      return res.status(400).json({
        error: "Exercise name is required"
      });
    }

    const existingExercise = await Exercise.findOne({
      user_id,
      _id: { $ne: id },
      name: {
        $regex: `^${normalizedName}$`,
        $options: "i"
      }
    });

    if (existingExercise) {
      return res.status(400).json({
        error: existingExercise.isArchived
          ? "An archived exercise already uses this name. Please choose a different name."
          : "Exercise already exists"
      });
    }

    updates.name = normalizedName;
  }

  if (metrics !== undefined) {
    updates.metrics = metrics;
  }

  const exercise = await Exercise.findOneAndUpdate(
    {
      user_id,
      _id: id
    },
    updates,
    {
      new: true,
      runValidators: true
    }
  );

  if (!exercise) {
    return res.status(400).json({
      error: "Exercise does not exist"
    });
  }

  const populatedExercise = await Exercise
    .findById(exercise._id)
    .populate("categoryId");

  res.status(200).json({
    ...populatedExercise.toObject(),
    workoutCount: await getWorkoutCount(
      exercise._id,
      user_id
    )
  });
};

const deleteExercise = async (req, res) => {
  const user_id = req.user._id;
  const { id } = req.params;

  const workoutCount = await getWorkoutCount(
    id,
    user_id
  );

  if (workoutCount === 0) {
    const exercise = await Exercise.findOneAndDelete({
      _id: id,
      user_id
    });

    if (!exercise) {
      return res.status(404).json({
        error: "Exercise does not exist"
      });
    }

    return res.status(200).json(exercise);
  }

  const exercise = await Exercise.findOneAndUpdate(
    {
      _id: id,
      user_id
    },
    {
      isArchived: true
    },
    {
      new: true
    }
  ).populate("categoryId");

  if (!exercise) {
    return res.status(404).json({
      error: "Exercise does not exist"
    });
  }

  return res.status(200).json(exercise);
};

module.exports = {
  getExercises,
  createExercise,
  updateExercise,
  deleteExercise
};