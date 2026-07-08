const Exercise = require("../models/exerciseModel");
const Category = require("../models/categoryModel");

const getExercises = async (req, res) => {
  const user_id = req.user._id;

  const exercises = await Exercise
    .find({ user_id })
    .populate("categoryId")
    .sort({ name: 1 });

  res.status(200).json(exercises);
};

const createExercise = async (req, res) => {
  const { name, categoryId } = req.body;
  const user_id = req.user._id;

  if (!name) {
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
      $regex: `^${name}$`,
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
    user_id
  });

  const populatedExercise = await Exercise
    .findById(exercise._id)
    .populate("categoryId");

  res.status(201).json(populatedExercise);
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

  res.status(200).json(populatedExercise);
};

const deleteExercise = async (req, res) => {
  const user_id = req.user._id;
  const { id } = req.params;

  const exercise = await Exercise.findOneAndDelete(
    { _id: id, user_id }
  );

  if (!exercise) {
    return res.status(400).json({
      error: "Exercise does not exist"
    });
  }

  res.status(200).json(exercise);
};

module.exports = { getExercises, createExercise, updateExercise, deleteExercise };