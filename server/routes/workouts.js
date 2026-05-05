const express = require("express");
const router = express.Router();

const {
  getWorkouts,
  getWorkout,
  createWorkout,
  updateWorkout,
  deleteWorkout
} = require("../controllers/workoutController");

const validateObjectId = require("../middleware/validateObjectId");

// routes
router.get("/", getWorkouts);
router.get("/:id", validateObjectId, getWorkout);
router.post("/", createWorkout);
router.patch("/:id", validateObjectId, updateWorkout);
router.delete("/:id", validateObjectId, deleteWorkout);

module.exports = router;