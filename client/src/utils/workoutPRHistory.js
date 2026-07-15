export function getWorkoutHistoryWithPRs(workouts) {

  const sortedWorkouts = workouts
    .map(workout => ({
      ...workout,
      exercises: workout.exercises.map(exercise => ({
        ...exercise,
        sets: exercise.sets.map(set => ({
          ...set
        }))
      }))
    }))
    .reverse();

  const exerciseRecords = {};

  sortedWorkouts.forEach(workout => {

    workout.exercises.forEach(exercise => {

      const exerciseId = exercise.exerciseId._id;

      if (!exerciseRecords[exerciseId]) {

        exerciseRecords[exerciseId] = {
          bestValues: {},
          bestDistanceTimes: {}
        };

      }

      const {
        bestValues,
        bestDistanceTimes
      } = exerciseRecords[exerciseId];

      exercise.sets.forEach(set => {

        set.personalRecords = {};

        const {
          weight,
          reps,
          distance,
          duration
        } = set.metrics;

        // Weight PR
        if (weight != null) {

          const bestWeight =
            bestValues.weight ?? -Infinity;

          if (weight > bestWeight) {

            bestValues.weight = weight;
            set.personalRecords.weight = true;

          }

        }

        // Reps PR
        if (reps != null) {

          const bestReps =
            bestValues.reps ?? -Infinity;

          if (reps > bestReps) {

            bestValues.reps = reps;
            set.personalRecords.reps = true;

          }

        }

        // Distance + Duration
        if (distance != null) {

          const bestDistance =
            bestValues.distance ?? -Infinity;

          if (distance > bestDistance) {

            bestValues.distance = distance;
            bestDistanceTimes[distance] = duration;

            set.personalRecords.distance = true;

          }

          else if (
            duration != null &&
            distance === bestDistance
          ) {

            const bestTime =
              bestDistanceTimes[distance];

            if (
              bestTime == null ||
              duration < bestTime
            ) {

              bestDistanceTimes[distance] =
                duration;

              set.personalRecords.duration = true;

            }

          }

        }

        // Duration-only exercises
        else if (duration != null) {

          const bestDuration =
            bestValues.duration ?? -Infinity;

          if (duration > bestDuration) {

            bestValues.duration = duration;
            set.personalRecords.duration = true;

          }

        }

      });

    });

  });

  return sortedWorkouts.reverse();

}