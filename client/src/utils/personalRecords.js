import { getWorkoutVolume } from "./workoutHelpers";

export const getPersonalRecords = (workouts) => {
  workouts = workouts || [];

  const allSets = workouts.flatMap(workout =>
    workout.exercises?.flatMap(exercise =>
      (exercise.sets || []).map((set) => ({
        ...set,
        workoutTitle: workout.title,
        workoutDate: workout.date,
        workoutId: workout._id,
        exerciseName: exercise.exerciseId?.name
      }))
    ) || []
  );

  const highestWeightSet = allSets.reduce((maxSet, set) =>

    (set.metrics?.weight || 0) >
      (maxSet.metrics?.weight || 0)
      ? set
      : maxSet,

    {
      metrics: {
        weight: 0
      }
    }
  );

  const highestWeightRecord = {

    value: highestWeightSet.metrics?.weight || 0,
    reps: highestWeightSet.metrics?.reps || 0,
    title: highestWeightSet.workoutTitle,
    exerciseName: highestWeightSet.exerciseName,
    date: highestWeightSet.workoutDate,
    id: highestWeightSet.workoutId
  };

  const longestDistanceSet = allSets.reduce((maxSet, set) =>

    (set.metrics?.distance || 0) > 
      (maxSet.metrics?.distance || 0)
      ? set
      : maxSet,
    {
      metrics: {
        distance: 0
      }
    }
  );

  const longestDistanceRecord = {

    value: longestDistanceSet.metrics?.distance || 0,
    title: longestDistanceSet.workoutTitle,
    exerciseName: longestDistanceSet.exerciseName,
    date: longestDistanceSet.workoutDate,
    id: longestDistanceSet.workoutId
  };

  const longestDurationSet = allSets.reduce((maxSet, set) =>

    (set.metrics?.duration || 0) >
     (maxSet.metrics?.duration || 0)
      ? set
      : maxSet,
    {
      metrics: {
        duration: 0
      }
    }
  );

  const longestDurationRecord = {

    value: longestDurationSet.metrics?.duration || 0,
    title: longestDurationSet.workoutTitle,
    exerciseName: longestDurationSet.exerciseName,
    date: longestDurationSet.workoutDate,
    id: longestDurationSet.workoutId
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
    title: workoutWithMostExercises.title,
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
    title: workoutWithHighestVolume.title,
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