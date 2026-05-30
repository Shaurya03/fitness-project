const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();
const cors = require("cors");

const app = express();
app.use(express.json());

app.use(cors());

// Test route
app.get("/", (req, res) => {
  res.send("API is running...");
});

// Routes
const workoutsRoutes = require("./routes/workouts");
app.use("/api/workouts", workoutsRoutes);

const userRoutes = require("./routes/user");
app.use("/api/users", userRoutes);

const exerciseRoutes = require("./routes/exercise");
app.use("/api/exercises", exerciseRoutes);

const PORT = 5000;

// Error handling middleware
const errorHandler = require("./middleware/errorHandler");
app.use(errorHandler);

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



