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

  return {
    highestWeight,
    longestDistance,
    longestDuration
  };
};