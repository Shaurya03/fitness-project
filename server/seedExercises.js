require("dotenv").config();

const mongoose = require("mongoose");

const Exercise = require("./models/exerciseModel");

const defaultExercises = require("./utils/defaultExercises");

const seedExercises = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    console.log("Connected to MongoDB");

    for (const exercise of defaultExercises) {
      await Exercise.findOneAndUpdate(
        {
          name: exercise.name,
          isDefault: true
        },

        {
          ...exercise,
          isDefault: true,
          user_id: null
        },

        {
          upsert: true,
        }
      );
    }

    console.log(`${defaultExercises.length} default exercises synced`);

    await mongoose.connection.close();
    console.log("Disconnected from MongoDB");
    process.exit(0);
  }
  catch (error) {
    console.error(error);
    process.exit(1);
  }
};

seedExercises();