const express = require("express");

const {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory
} = require("../controllers/categoryController");

const requireAuth = require("../middleware/requireAuth");

const router = express.Router();

router.use(requireAuth);

router.get("/", getCategories);

router.post("/", createCategory);

router.patch("/:id", updateCategory);

router.delete("/:id", deleteCategory);

module.exports = router;