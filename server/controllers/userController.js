const User = require('../models/userModel');
const jwt = require('jsonwebtoken');
const Category = require("../models/categoryModel");
const Exercise = require("../models/exerciseModel");
const DEFAULT_CATEGORIES = require("../utils/defaultCategories");
const DEFAULT_EXERCISES = require("../utils/defaultExercises");

const createToken = (_id) => {
  return jwt.sign({ _id }, process.env.SECRET, { expiresIn: '3d' });
};

const signupUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.signup(email, password);

    const categories = await Category.insertMany(
      DEFAULT_CATEGORIES.map(
        (category) => ({
          ...category,
          user_id: user._id
        })
      )
    );

    const categoryMap = {};

    categories.forEach((category) => {
      categoryMap[category.name] = category._id;
    });

    await Exercise.insertMany(
      DEFAULT_EXERCISES.map(
        (exercise) => ({
          name: exercise.name,
          categoryId: categoryMap[exercise.category],
          user_id: user._id
        })
      )
    );

    const token = createToken(user._id);

    res.status(200).json({
      email,
      token
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.login(email, password);
    const token = createToken(user._id);

    res.status(200).json({
      email,
      token
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = { signupUser, loginUser };