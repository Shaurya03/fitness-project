const express = require("express");

const {
  getExercises,
  createExercise,
  updateExercise,
  deleteExercise
} = require("../controllers/exerciseController");

const requireAuth = require("../middleware/requireAuth");

const router = express.Router();

router.use(requireAuth);

router.get("/", getExercises);

router.post("/", createExercise);

router.patch("/:id", updateExercise);

router.delete("/:id", deleteExercise);

module.exports = router;