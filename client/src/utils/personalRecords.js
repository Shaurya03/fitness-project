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

  return {
    highestWeight
  };
};