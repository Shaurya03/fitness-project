const Category = require("../models/categoryModel");

const getCategories = async (req, res) => {
  const user_id = req.user._id;

  const categories = await Category
    .find({ user_id })
    .sort({ name: 1 })

  res.status(200).json(categories);
};

module.exports = {
  getCategories
};