import { format } from "date-fns";
import { getWorkoutVolume } from "../utils/workoutHelpers";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid
} from "recharts";
import { formatMetric } from "../utils/metricFormatter";
import { DEFAULT_SETTINGS } from "../utils/settings";

function VolumeChart({ workouts }) {
  const settings = DEFAULT_SETTINGS;
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

  if (!chartData.length) {
    return (
      <div className="chart-card">
        <h3>Workout Volume</h3>
        <div className="chart-empty">
          No workout data available yet.
        </div>
      </div>
    );
  }

  return (
    <div className="chart-card">
      <h3>Workout Volume Over Time</h3>

      <p className="chart-summary">
        {formatMetric(
          "weight",
          chartData.reduce(
            (sum, item) => sum + item.volume,
            0
          ),
          settings
        )}{" "}
        total volume
      </p>

      <ResponsiveContainer
        width="100%"
        height={300}
      >
        <LineChart
          data={chartData}
          margin={{
            top: 20,
            right: 20,
            left: 20,
            bottom: 10
          }}
        >
          <CartesianGrid
            strokeDasharray="3 3"
            vertical={false}
          />
          <XAxis
            dataKey="date"
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            domain={[
              (min) => min * 0.9,
              (max) => max * 1.1
            ]}
            axisLine={false}
            tickLine={false}
            tickFormatter={(value) =>
              value >= 1000
                ? `${(value / 1000).toFixed(0)}k`
                : value
            }
          />
          <Tooltip
            formatter={(value) =>
              formatMetric("weight", value, settings)
            }
          />

          <Line
            type="monotone"
            dataKey="volume"
            stroke="#10B981"
            strokeWidth={3}
            strokeLinecap="round"
            dot={{ r: 3 }}
            activeDot={{ r: 6 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

export default VolumeChart;
