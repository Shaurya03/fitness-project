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
    workout.exercises?.flatMap(exercise =>
      exercise.type === "cardio"
        ? [{
          ...exercise,
          workoutTitle: workout.title,
          workoutDate: workout.date,
          workoutId: workout._id,
          exerciseName: exercise.name
        }]
        : []
    ) || []
  );

  const longestDistanceExercise = cardioExercises.reduce((maxExercise, exercise) =>

    exercise.distance > maxExercise.distance
      ? exercise
      : maxExercise,
    {
      distance: 0
    }
  );

  const longestDistanceRecord = {

    value: longestDistanceExercise.distance,
    title: longestDistanceExercise.workoutTitle,
    exerciseName: longestDistanceExercise.name,
    date: longestDistanceExercise.workoutDate,
    id: longestDistanceExercise.workoutId
  };

  const longestDurationExercise = cardioExercises.reduce((maxExercise, exercise) =>

    exercise.duration > maxExercise.duration
      ? exercise
      : maxExercise,
    {
      duration: 0
    }
  );

  const longestDurationRecord = {

    value: longestDurationExercise.duration,
    title: longestDurationExercise.workoutTitle,
    exerciseName: longestDurationExercise.name,
    date: longestDurationExercise.workoutDate,
    id: longestDurationExercise.workoutId
  };

  const workoutWithMostExercises = workouts.reduce((maxWorkout, workout) => {

    const currentWorkoutExercises = workout.exercises?.length || 0;

    const maxWorkoutExercises = maxWorkout.exercises?.length || 0;

    return currentWorkoutExercises > maxWorkoutExercises
      ? workout
      : maxWorkout;

  }, {}
  );

  const mostExercisesRecord = {

    value: workoutWithMostExercises.exercises?.length || 0,
    title: workoutWithMostExercises.title || "None",
    date: workoutWithMostExercises.date || null,
    id: workoutWithMostExercises._id || null
  };

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
    longestDistanceRecord,
    longestDurationRecord,
    mostExercisesRecord,
    highestVolumeRecord
  };
};