import { useState } from "react";
import { format } from "date-fns";
import { useWorkoutContext } from "../hooks/useWorkoutContext";
import { getDashboardStats } from "../utils/dashboardStats";
import { getPersonalRecords } from "../utils/personalRecords";
import { formatMetric } from "../utils/metricFormatter";
import { DEFAULT_SETTINGS } from "../utils/settings";
import StatCard from "../components/StatCard";
import PersonalRecordCard from "../components/PersonalRecordCard";
import WorkoutPreviewModal from "../components/WorkoutPreviewModal";
import WorkoutDetails from "../components/WorkoutDetails";
import VolumeChart from "../components/VolumeChart";
import CategoryBreakdownChart from "../components/CategoryBreakdownChart";
import "./Dashboard.css";

function Dashboard() {
  const { workouts } = useWorkoutContext();

  const [selectedWorkout, setSelectedWorkout] = useState(null);

  const settings = DEFAULT_SETTINGS;

  const stats = getDashboardStats(workouts);

  const prs = getPersonalRecords(workouts);

  const openWorkoutPreview = (workoutId) => {
    const workout = workouts.find(
      workout => workout._id === workoutId
    );

    setSelectedWorkout(workout);
  }

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
          value={formatMetric(
            "weight",
            stats.totalVolume,
            settings
          )}
        />

        <StatCard
          title="Total Distance"
          value={formatMetric(
            "distance",
            stats.totalDistance,
            settings
          )}
        />

        <StatCard
          title="Total Duration"
          value={formatMetric(
            "duration",
            stats.totalDuration,
            settings
          )}
        />

      </div>

      <h2>Personal Records</h2>

      <div className="stats-grid">

        <PersonalRecordCard
          title="Highest Weight"
          value={formatMetric(
            "weight",
            prs.highestWeightRecord?.value || 0,
            settings
          )}
          exercise={prs.highestWeightRecord?.exerciseName || "None"}
          workout={prs.highestWeightRecord?.title || "None"}
          date={
            prs.highestWeightRecord.date
              ?
              format(new Date(prs.highestWeightRecord?.date), "d MMM yyyy")
              :
              "No Date"
          }
          onViewWorkout={() =>
            openWorkoutPreview(prs.highestWeightRecord?.id)
          }
        />

        <PersonalRecordCard
          title="Longest Distance"
          value={formatMetric(
            "distance",
            prs.longestDistanceRecord?.value || 0,
            settings
          )}
          exercise={prs.longestDistanceRecord.exerciseName || "None"}
          workout={prs.longestDistanceRecord?.title || "None"}
          date={
            prs.longestDistanceRecord.date
              ?
              format(new Date(prs.longestDistanceRecord?.date), "d MMM yyyy")
              :
              "No Date"
          }
          onViewWorkout={() =>
            openWorkoutPreview(prs.longestDistanceRecord?.id)
          }
        />

        <PersonalRecordCard
          title="Longest Duration"
          value={formatMetric(
            "duration",
            prs.longestDurationRecord?.value || 0,
            settings
          )}
          exercise={prs.longestDurationRecord.exerciseName || "None"}
          workout={prs.longestDurationRecord?.title || "None"}
          date={
            prs.longestDurationRecord.date
              ?
              format(new Date(prs.longestDurationRecord?.date), "d MMM yyyy")
              :
              "No Date"
          }
          onViewWorkout={() =>
            openWorkoutPreview(prs.longestDurationRecord?.id)
          }
        />

        <PersonalRecordCard
          title="Most Exercises"
          value={prs.mostExercisesRecord?.value || 0}
          workout={prs.mostExercisesRecord?.title || "None"}
          date={
            prs.mostExercisesRecord.date
              ?
              format(new Date(prs.mostExercisesRecord?.date), "d MMM yyyy")
              :
              "No Date"
          }
          onViewWorkout={() =>
            openWorkoutPreview(prs.mostExercisesRecord?.id)
          }
        />

        <PersonalRecordCard
          title="Highest Volume Workout"
          value={formatMetric(
            "weight",
            prs.highestVolumeRecord?.volume || 0,
            settings
          )}
          workout={prs.highestVolumeRecord?.title || "None"}
          date={
            prs.highestVolumeRecord.date
              ?
              format(new Date(prs.highestVolumeRecord?.date), "d MMM yyyy")
              :
              "No Date"
          }
          onViewWorkout={() =>
            openWorkoutPreview(prs.highestVolumeRecord?.id)
          }
        />

      </div>

      {selectedWorkout && (
        <WorkoutPreviewModal
          onClose={() => setSelectedWorkout(null)}
        >
          <WorkoutDetails
            workout={selectedWorkout}
            preview={true}
          />
        </WorkoutPreviewModal>
      )}

      <h2>Progress Charts</h2>

      <div className="charts-section">
        <CategoryBreakdownChart workouts={workouts} />
        <VolumeChart workouts={workouts} />
      </div>

    </div>

  );
}

export default Dashboard;