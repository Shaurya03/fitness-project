import { useWorkoutContext } from "../hooks/useWorkoutContext";
import { getDashboardStats } from "../utils/dashboardStats";
import { getPersonalRecords } from "../utils/personalRecords";
import "./Dashboard.css";

function Dashboard() {
  const { workouts } = useWorkoutContext();

  const stats = getDashboardStats(workouts);

  const prs = getPersonalRecords(workouts);

  return (
    <div className="dashboard">

      <h2>Dashboard</h2>

      <div className="stats-grid">

        <div className="stat-card">
          <h3>Total Workouts</h3>
          <p>{stats.totalWorkouts}</p>
        </div>

        <div className="stat-card">
          <h3>Exercises</h3>
          <p>{stats.totalExercises}</p>
        </div>

        <div className="stat-card">
          <h3>Sets</h3>
          <p>{stats.totalSets}</p>
        </div>

        <div className="stat-card">
          <h3>Top Body Part</h3>
          <p>{stats.mostTrainedCategory}</p>
        </div>

        <div className="stat-card">
          <h3>Volume</h3>
          <p>{stats.totalVolume} kg</p>
        </div>

        <div className="stat-card">
          <h3>Total Distance</h3>
          <p>{stats.totalDistance} km</p>
        </div>

        <div className="stat-card">
          <h3>Total Duration</h3>
          <p>{stats.totalDuration} min</p>
        </div>

      </div>

      <h2>Personal Records</h2>

      <div className="stats-grid">

        <div className="stat-card">
          <h3>Highest Weight</h3>
          <p>{prs.highestWeight} kg</p>
        </div>

        <div className="stat-card">
          <h3>Longest Distance</h3>
          <p>{prs.longestDistance} km</p>
        </div>

        <div className="stat-card">
          <h3>Longest Duration</h3>
          <p>{prs.longestDuration} min</p>
        </div>

        <div className="stat-card">
          <h3>Most Exercises</h3>
          <p>{prs.mostExercises}</p>
          <p>{prs.mostExercisesWorkout}</p>
        </div>

        <div className="stat-card">
          <h3>Highest Volume Workout</h3>
          <p>{prs.highestWorkoutVolume} kg</p>
          <p>{prs.highestVolumeWorkout}</p>
        </div>

      </div>

    </div>
  );
}

export default Dashboard;