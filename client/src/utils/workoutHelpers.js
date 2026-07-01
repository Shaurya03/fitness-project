export const getWorkoutVolume = (workout) => {

  return workout.exercises?.reduce(
    (exerciseTotal, exercise) =>

      exerciseTotal +

      (exercise.sets?.reduce(
        (setTotal, set) =>

          setTotal +
          (
            (set.metrics?.weight || 0) *
            (set.metrics?.reps || 0)
          ),

        0
      ) || 0),

    0
  ) || 0;

};