const Category = require("../models/categoryModel");

const getCategories = async (req, res) => {
  const user_id = req.user._id;

  const categories = await Category
    .find({ user_id })
    .sort({ name: 1 });

  res.status(200).json(categories);
};

const createCategory = async (req, res) => {
  const user_id = req.user._id;

  const { name, defaultMetrics } = req.body;

  if (!name) {
    return res.status(400).json({
      error: "Category name is required"
    });
  }

  const existingCategory = await Category.findOne({
    user_id,
    name: {
      $regex: `^${name}$`,
      $options: "i"
    }
  });

  if (existingCategory) {
    return res.status(400).json({
      error: "Category already exists"
    });
  }

  const category = await Category.create({
    name,
    defaultMetrics,
    user_id
  });

  res.status(201).json(category);
};

module.exports = {
  getCategories,
  createCategory
};