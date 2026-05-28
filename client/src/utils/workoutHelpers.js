export const getWorkoutVolume = (workout) => {

  return workout.exercises?.reduce((exerciseTotal, exercise) =>
    exerciseTotal +
    (exercise.sets?.reduce((setTotal, set) =>
      setTotal +
      (set.load * set.reps), 0
    ) || 0
    ), 0
  ) || 0
};