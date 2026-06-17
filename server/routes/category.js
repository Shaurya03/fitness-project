const express = require("express");

const {
  getCategories,
  createCategory,
} = require("../controllers/categoryController");

const requireAuth = require("../middleware/requireAuth");

const router = express.Router();

router.use(requireAuth);

router.get("/", getCategories);

router.post("/", createCategory);

module.exports = router;