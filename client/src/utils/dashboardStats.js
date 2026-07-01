import { getWorkoutVolume } from "./workoutHelpers";

export const getDashboardStats = (workouts) => {

  workouts = workouts || [];

  const totalWorkouts = workouts.length;

  const totalExercises = workouts.reduce((total, workout) =>
    total + (workout.exercises?.length || 0), 0
  );

  const totalSets = workouts.reduce((total, workout) =>
    total +
    (workout.exercises?.reduce((exerciseTotal, exercise) =>
      exerciseTotal +
      (exercise.sets?.length || 0), 0
    )
    ), 0
  );

  const categoryCounts = {};

  workouts.forEach((workout) => {
    workout.exercises?.forEach((exercise) => {

      const category =
        exercise.exerciseId?.categoryId?.name;

      if (category) {
        categoryCounts[category] =
          (categoryCounts[category] || 0) + 1;
      }
    });
  });

  const mostTrainedCategory = Object.keys(categoryCounts).
    reduce((a, b) =>
      categoryCounts[a] > categoryCounts[b] ? a : b, "None"
    );

  const totalVolume = workouts.reduce((total, workout) =>
    total + getWorkoutVolume(workout), 0
  );

  let totalDistance = 0;
  let totalDuration = 0;

  workouts.forEach(workout => {

    workout.exercises?.forEach(exercise => {

      exercise.sets?.forEach(set => {

        totalDistance +=
          set.metrics?.distance || 0;

        totalDuration +=
          set.metrics?.duration || 0;

      });

    });

  });

  return {
    totalWorkouts,
    totalExercises,
    totalSets,
    mostTrainedCategory,
    totalVolume,
    totalDistance,
    totalDuration,
  };
};