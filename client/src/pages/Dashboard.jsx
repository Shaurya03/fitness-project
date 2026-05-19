import { useWorkoutContext } from "../hooks/useWorkoutContext";
import "./Dashboard.css";

function Dashboard() {
  const { workouts } = useWorkoutContext();

  const totalWorkouts = workouts?.length || 0;

  const totalLoad = workouts?.reduce(
    (total, workout) => total + Number(workout.load),
    0
  );

  const totalReps = workouts?.reduce(
    (total, workout) => total + Number(workout.reps),
    0
  );

  const categoryCounts = workouts?.reduce((acc, workout) => {
    const category = workout.category;
    acc[category] = (acc[category] || 0) + 1;
    return acc;
  }, {});

  return (
    <div className="dashboard">

      <h2>Dashboard</h2>

      <div className="stats-grid">

        <div className="stat-card">
          <h3>Total Workouts</h3>
          <p>{totalWorkouts}</p>
        </div>

        <div className="stat-card">
          <h3>Total Load</h3>
          <p>{totalLoad} kg</p>
        </div>

        <div className="stat-card">
          <h3>Total Reps</h3>
          <p>{totalReps}</p>
        </div>

      </div>
      <div className="dashboard-section">

        <h3>Workout Categories</h3>

        <div className="category-stats">

          {Object.entries(categoryCounts || {}).map(([category, count]) => (
            <div key={category} className="category-card">
              <h4>{category}</h4>
              <p>{count} {count === 1 ? "workout" : "workouts"}</p>
            </div>
          ))}

        </div>

      </div>
      <div className="dashboard-section">

        <h3>Recent Workouts</h3>

        <div className="recent-workouts">

          {workouts?.length === 0 ? (
            <p>No recent workouts.</p>
          ) : (
            workouts?.slice(0, 3).map((workout) => (
              <div key={workout._id} className="recent-workout-card">
                <h4>{workout.title}</h4>
                <p>{workout.category}</p>
                <p>{workout.load} kg x {workout.reps} reps</p>
              </div>
            )))}

        </div>

      </div>

    </div>
  );
}

export default Dashboard;