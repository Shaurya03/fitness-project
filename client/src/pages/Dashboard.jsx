import { useWorkoutContext } from "../hooks/useWorkoutContext";
import "./Dashboard.css";

function Dashboard() {
  const { workouts } = useWorkoutContext();

  const totalWorkouts = workouts?.length || 0;

  const totalExercises = workouts?.reduce((total, workout) =>
    total + (workout.exercises?.length || 0), 0
  );

  const totalSets = workouts?.reduce((total, workout) =>
    total +
    (workout.exercises?.reduce((exerciseTotal, exercise) =>
      exerciseTotal +
      (exercise.sets?.length || 0), 0
    )
    ), 0
  );

  const categoryCounts = {};

  workouts?.forEach((workout) => {
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

  const totalVolume = workouts?.reduce((total, workout) =>
    total +
    (workout.exercises?.reduce((exerciseTotal, exercise) =>
      exerciseTotal +
      (exercise.sets?.reduce((setTotal, set) =>
        setTotal +
        (set.load * set.reps), 0) || 0
      ), 0
    ) || 0
    ), 0
  ) || 0

  const cardioExercises = workouts?.flatMap(workout =>
    workout.exercises?.filter(exercise =>
      exercise.type === "cardio"
    ) || []
  ) || [];

  const totalDistance = cardioExercises.reduce((total, exercise) =>
    total + (exercise.distance || 0), 0
  );

  const totalDuration = cardioExercises.reduce((total, exercise) =>
    total + (exercise.duration || 0), 0
  );

  const longestDistance = cardioExercises.reduce((max, exercise) =>
    exercise.distance > max ? exercise.distance : max, 0
  );

  const longestDuration = cardioExercises.reduce((max, exercise) =>
    exercise.duration > max ? exercise.duration : max, 0
  );

  return (
    <div className="dashboard">

      <h2>Dashboard</h2>

      <div className="stats-grid">

        <div className="stat-card">
          <h3>Total Workouts</h3>
          <p>{totalWorkouts}</p>
        </div>

        <div className="stat-card">
          <h3>Exercises</h3>
          <p>{totalExercises}</p>
        </div>

        <div className="stat-card">
          <h3>Sets</h3>
          <p>{totalSets}</p>
        </div>

        <div className="stat-card">
          <h3>Top Body Part</h3>
          <p>{mostTrainedCategory}</p>
        </div>

        <div className="stat-card">
          <h3>Volume</h3>
          <p>{totalVolume} kg</p>
        </div>

        <div className="stat-card">
          <h3>Total Distance</h3>
          <p>{totalDistance} km</p>
        </div>

        <div className="stat-card">
          <h3>Total Duration</h3>
          <p>{totalDuration} min</p>
        </div>

        <div className="stat-card">
          <h3>Longest Distance</h3>
          <p>{longestDistance} km</p>
        </div>

        <div className="stat-card">
          <h3>Longest Duration</h3>
          <p>{longestDuration} min</p>
        </div>

      </div>

    </div>
  );
}

export default Dashboard;