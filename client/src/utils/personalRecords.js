import { getWorkoutVolume } from "./workoutHelpers";

export const getPersonalRecords = (workouts) => {
  workouts = workouts || [];

  const strengthSets = workouts.flatMap(workout =>

    workout.exercises?.flatMap(exercise =>

      exercise.type === "strength"
        ? exercise.sets || []
        : []
    ) || []
  );

  const highestWeight = strengthSets.reduce((max, set) =>
    set.load > max
      ? set.load
      : max, 0
  );

  const cardioExercises = workouts.flatMap(workout =>
    workout.exercises?.filter(exercise =>
      exercise.type === "cardio"
    ) || []
  );

  const longestDistance = cardioExercises.reduce((max, exercise) =>
    exercise.distance > max ? exercise.distance : max, 0
  );

  const longestDuration = cardioExercises.reduce((max, exercise) =>
    exercise.duration > max ? exercise.duration : max, 0
  );

  const workoutWithMostExercises = workouts.reduce((maxWorkout, workout) =>

    (workout.exercises?.length || 0) > (maxWorkout.exercises?.length || 0)
      ? workout
      : maxWorkout, {}
  );

  const mostExercises = workoutWithMostExercises.exercises?.length || 0;

  const mostExercisesWorkout = workoutWithMostExercises.title || "None";

  const workoutWithHighestVolume = workouts.reduce((maxWorkout, workout) => {

    const currentWorkoutVolume = getWorkoutVolume(workout);

    const maxWorkoutVolume = getWorkoutVolume(maxWorkout);

    return currentWorkoutVolume > maxWorkoutVolume
      ? workout
      : maxWorkout;

  }, {}
  );

  const highestWorkoutVolume = getWorkoutVolume(workoutWithHighestVolume);

  const highestVolumeWorkout = workoutWithHighestVolume.title || "None";

  return {
    highestWeight,
    longestDistance,
    longestDuration,
    mostExercises,
    mostExercisesWorkout,
    highestWorkoutVolume,
    highestVolumeWorkout
  };
};