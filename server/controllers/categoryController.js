const Category = require("../models/categoryModel");
const Exercise = require("../models/exerciseModel");
const CATEGORY_COLORS = require("../utils/categoryColors");

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

  const normalizedName =
    typeof name === "string"
      ? name.trim()
      : undefined;

  if (!normalizedName) {
    return res.status(400).json({
      error: "Category name is required"
    });
  }

  const existingCategory = await Category.findOne({
    user_id,
    name: {
      $regex: `^${normalizedName}$`,
      $options: "i"
    }
  });

  if (existingCategory) {
    return res.status(400).json({
      error: "Category already exists"
    });
  }

  const existingCategories = await Category.find({ user_id });

  const usedColors = existingCategories.map(
    category => category.color
  );

  let color = CATEGORY_COLORS.find(
    color => !usedColors.includes(color)
  );

  if (!color) {
    const colorIndex =
      existingCategories.length % CATEGORY_COLORS.length;

    color = CATEGORY_COLORS[colorIndex];
  }

  const category = await Category.create({
    name: normalizedName,
    color,
    defaultMetrics,
    user_id
  });

  res.status(201).json(category);
};

const updateCategory = async (req, res) => {
  const user_id = req.user._id;
  const { id } = req.params;
  const { name, defaultMetrics } = req.body;

  const normalizedName =
    typeof name === "string"
      ? name.trim()
      : undefined;

  const updates = {};

  if (name !== undefined && !normalizedName) {
    return res.status(400).json({
      error: "Category name is required"
    });
  }

  if (name !== undefined) {
    updates.name = normalizedName;
  }

  if (defaultMetrics !== undefined) {
    updates.defaultMetrics = defaultMetrics;
  }

  if (Object.keys(updates).length === 0) {
    return res.status(400).json({
      error: "No valid fields to update"
    });
  }

  if (name !== undefined) {
    const existingCategory = await Category.findOne({
      user_id,
      _id: { $ne: id },
      name: {
        $regex: `^${normalizedName}$`,
        $options: "i"
      }
    });

    if (existingCategory) {
      return res.status(400).json({
        error: "Category already exists"
      });
    }
  }

  const category = await Category.findOneAndUpdate(
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

  if (!category) {
    return res.status(400).json({
      error: "Category does not exist"
    });
  }

  res.status(200).json(category);
};

const deleteCategory = async (req, res) => {
  const user_id = req.user._id;
  const { id } = req.params;

  const exercises = await Exercise.findOne({
    categoryId: id,
    user_id
  });

  if (exercises) {
    return res.status(400).json({
      error: "Cannot delete category with exercises"
    });
  }

  const category = await Category.findOneAndDelete(
    { _id: id, user_id }
  );

  if (!category) {
    return res.status(400).json({
      error: "Category does not exist"
    });
  }

  res.status(200).json(category);
};

module.exports = {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory
};