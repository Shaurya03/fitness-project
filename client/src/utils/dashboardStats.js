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

      if (exercise.category) {
        categoryCounts[exercise.category] =
          (categoryCounts[exercise.category] || 0) + 1;
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

  const cardioExercises = workouts.flatMap(workout =>
    workout.exercises?.filter(exercise =>
      exercise.type === "cardio"
    ) || []
  );

  const totalDistance = cardioExercises.reduce((total, exercise) =>
    total + (exercise.distance || 0), 0
  );

  const totalDuration = cardioExercises.reduce((total, exercise) =>
    total + (exercise.duration || 0), 0
  );

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