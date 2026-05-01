const express = require("express");
const router = express.Router();

// GET all workouts
router.get("/", (req, res) => {
  res.json({ message: "Get all workouts"});
});

// POST workout
router.post("/", (req, res) => {
  res.json({ message: "Create a new workout"});
});

module.exports = router;