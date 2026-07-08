const Exercise = require("../models/exerciseModel");
const Category = require("../models/categoryModel");
const Workout = require("../models/workoutModel");

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
    exercises.map(async exercise => {
      const workoutCount = await Workout.countDocuments({
        user_id,
        "exercises.exerciseId": exercise._id
      });

      return {
        ...exercise.toObject(),
        workoutCount
      };
    })
  );

  res.status(200).json(exercisesWithCounts);
};

const createExercise = async (req, res) => {
  const { name, categoryId } = req.body;
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

  if (existingExercise) {
    return res.status(400).json({
      error: "Exercise already exists"
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

  if (name !== undefined) {
    updates.name = name.trim();
  }

  if (metrics !== undefined) {
    updates.metrics = metrics;
  }

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

  const workoutCount = await Workout.countDocuments({
    user_id,
    "exercises.exerciseId": exercise._id
  });

  res.status(200).json({
    ...populatedExercise.toObject(),
    workoutCount
  });
};

const deleteExercise = async (req, res) => {
  const user_id = req.user._id;
  const { id } = req.params;

  const workoutCount = await Workout.countDocuments({
    user_id,
    "exercises.exerciseId": id
  });

  let exercise;

  if (workoutCount === 0) {

    exercise = await Exercise.findOneAndDelete({
      _id: id,
      user_id
    });

  } else {

    exercise = await Exercise.findOneAndUpdate(
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
    );

  }

  if (!exercise) {
    return res.status(400).json({
      error: "Exercise does not exist"
    });
  }

  const populatedExercise = await Exercise
    .findById(exercise._id)
    .populate("categoryId");

  res.status(200).json({
    exercise: populatedExercise,
    workoutCount,
    archived: workoutCount > 0
  });
};

module.exports = { getExercises, createExercise, updateExercise, deleteExercise };