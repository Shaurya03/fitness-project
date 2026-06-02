const Exercise = require("../models/exerciseModel");

const getExercises = async (req, res) => {
  const user_id = req.user._id;

  const exercises = await Exercise
    .find({
      $or: [
        { isDefault: true },
        { user_id }
      ]
    })
    .sort({ name: 1 });

  res.status(200).json(exercises);
};

const createExercise = async (req, res) => {
  const { name, type, category } = req.body;
  const user_id = req.user._id;

  if (!name) {
    return res.status(400).json({
      error: "Exercise name is required"
    });
  }

  if (!type) {
    return res.status(400).json({
      error: "Exercise type is required"
    });
  }

  if (type === "strength" && !category) {
    return res.status(400).json({
      error: "Category is required"
    });
  }

  const existingExercise = await Exercise
    .findOne({
      name: { $regex: `^${name}$`, $options: "i" }
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

  res.status(201).json(exercise);
};

const updateExercise = async (req, res) => {
  const user_id = req.user._id;
  const { id } = req.params;
  const { name } = req.body;

  if (!name) {
    return res.status(400).json({
      error: "Exercise name is required"
    });
  }

  const exercise = await Exercise.findOneAndUpdate(
    {
      user_id,
      _id: id
    },
    {
      name
    },
    {
      new: true
    }
  );

  if (!exercise) {
    return res.status(400).json({
      error: "Exercise does not exist"
    });
  }

  res.status(200).json(exercise);
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