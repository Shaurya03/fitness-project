import { getWorkoutVolume } from "./workoutHelpers";

export const getPersonalRecords = (workouts) => {
  workouts = workouts || [];

  const strengthSets = workouts.flatMap(workout =>

    workout.exercises?.flatMap(exercise =>

      exercise.type === "strength"
        ? (exercise.sets || []).map((set) => ({
          ...set,
          workoutTitle: workout.title,
          workoutDate: workout.date,
          workoutId: workout._id,
          exerciseName: exercise.name
        }))
        : []
    ) || []
  );

  const highestWeightSet = strengthSets.reduce((maxSet, set) =>
    set.load > maxSet.load
      ? set
      : maxSet, 
      {
        load: 0
      }
  );

  const highestWeightRecord = {

    value: highestWeightSet.load,
    reps: highestWeightSet.reps,
    title: highestWeightSet.workoutTitle,
    exerciseName: highestWeightSet.exerciseName,
    date: highestWeightSet.workoutDate,
    id: highestWeightSet.workoutId
  };

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

  const highestVolumeRecord = {

    id: workoutWithHighestVolume._id || null,
    title: workoutWithHighestVolume.title || "None",
    volume: getWorkoutVolume(workoutWithHighestVolume),
    date: workoutWithHighestVolume.date || null
  };

  return {
    highestWeightRecord,
    longestDistance,
    longestDuration,
    mostExercises,
    mostExercisesWorkout,
    highestVolumeRecord
  };
};