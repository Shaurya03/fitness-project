const express = require("express");

const {
  getExercises,
  createExercise
} = require("../controllers/exerciseController");

const requireAuth = require("../middleware/requireAuth");

const router = express.Router();

router.use(requireAuth);

router.get("/", getExercises);

router.post("/", createExercise);

module.exports = router;