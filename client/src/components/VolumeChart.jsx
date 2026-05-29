import { format } from "date-fns";
import { getWorkoutVolume } from "../utils/workoutHelpers";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer
} from "recharts";

function VolumeChart({ workouts }) {
  const volumeByDate = {};

  workouts?.forEach(workout => {
    const dateKey = format(
      new Date(workout.date), "yyyy-MM-dd"
    );

    const volume = getWorkoutVolume(workout);

    volumeByDate[dateKey] = (volumeByDate[dateKey] || 0) + volume;
  });

  const chartData = Object.entries(volumeByDate)
    .sort(([a], [b]) =>
      new Date(a) - new Date(b)
    )
    .map(([date, volume]) => ({
      date: format(new Date(date), "d MMM"),
      volume
    }));

  return (
    <div className="chart-card">
      <h3>Workout Volume Over Time</h3>

      <ResponsiveContainer
        width="100%"
        height={300}
      >
        <LineChart data={chartData}>
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />

          <Line
            type="monotone"
            dataKey="volume"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

export default VolumeChart;
