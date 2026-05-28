import StatCard from "../components/StatCard";
import { format } from "date-fns";
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

        <StatCard
          title="Total Workouts"
          value={stats.totalWorkouts}
        />

        <StatCard
          title="Exercises"
          value={stats.totalExercises}
        />

        <StatCard
          title="Sets"
          value={stats.totalSets}
        />

        <StatCard
          title="Top Body Part"
          value={stats.mostTrainedCategory}
        />

        <StatCard
          title="Volume"
          value={`${stats.totalVolume} kg`}
        />

        <StatCard
          title="Total Distance"
          value={`${stats.totalDistance} km`}
        />

        <StatCard
          title="Total Duration"
          value={`${stats.totalDuration} min`}
        />

      </div>

      <h2>Personal Records</h2>

      <div className="stats-grid">

        <StatCard
          title="Highest Weight"
          value={`${prs.highestWeight} kg`}
        />

        <StatCard
          title="Longest Distance"
          value={`${prs.longestDistance} km`}
        />

        <StatCard
          title="Longest Duration"
          value={`${prs.longestDuration} min`}
        />

        <StatCard
          title="Most Exercises"
          value={prs.mostExercises}
          subtitle={prs.mostExercisesWorkout}
        />

        <StatCard
          title="Highest Volume Workout"
          value={`${prs.highestVolumeRecord?.volume || 0} kg`}
          subtitle={prs.highestVolumeRecord?.title || "None"}
          extra={
            prs.highestVolumeRecord.date
              ?
              format(new Date(prs.highestVolumeRecord?.date), "d MMM yyyy")
              :
              "No Date"
          }
        />

      </div>

    </div>
  );
}

export default Dashboard;