const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();

const app = express();

app.use(express.json());

// Routes
const workoutsRoutes = require("./routes/workouts");
app.use("/api/workouts", workoutsRoutes);

// Test route
app.get("/", (req, res) => {
  res.send("API is running...");
});

const PORT = 5000;

// Connect to MongoDB and start the server
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log("Connected to MongoDB");
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error("Error connecting to MongoDB:", error);
  });

