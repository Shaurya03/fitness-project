const express = require("express");
const router = express.Router();

const {
  getWorkouts,
  getWorkout,
  createWorkout,
  updateWorkout,
  deleteWorkout
} = require("../controllers/workoutController");

const mongoose = require("mongoose");

const validateObjectId = (req, res, next) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ error: "Invalid workout ID" });
  }
  next();
};

// routes
router.get("/", getWorkouts);
router.get("/:id", validateObjectId, getWorkout);
router.post("/", createWorkout);
router.patch("/:id", validateObjectId, updateWorkout);
router.delete("/:id", validateObjectId, deleteWorkout);

module.exports = router;