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
  const user_id = req.user._id;

  const exercise = await Exercise.create({
    ...req.body,
    user_id
  });

  res.status(201).json(exercise);
};

module.exports = { getExercises, createExercise };