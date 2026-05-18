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
          <p>{totalLoad}</p>
        </div>

        <div className="stat-card">
          <h3>Total Reps</h3>
          <p>{totalReps}</p>
        </div>

      </div>

    </div>
  );
}

export default Dashboard;