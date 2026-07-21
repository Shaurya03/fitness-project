import { format } from "date-fns";
import { getWorkoutVolume } from "../utils/workoutHelpers";
import { UNITS } from "../utils/units";
import { DEFAULT_UNITS } from "../utils/settings";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid
} from "recharts";
import { useSettings } from "../hooks/useSettings";
import "./DashboardCharts.css";

function VolumeChart({ workouts }) {

  const { settings } = useSettings();

  const weightSystem =
    settings?.weightSystem ?? "metric";

  const weightUnit =
    DEFAULT_UNITS[weightSystem].weight;

  const convertWeight =
    UNITS.weight[weightUnit].fromBase;

  const volumeByDate = {};

  workouts?.forEach(workout => {

    const dateKey = format(
      new Date(workout.date),
      "yyyy-MM-dd"
    );

    const volume = getWorkoutVolume(workout);

    volumeByDate[dateKey] =
      (volumeByDate[dateKey] || 0) + volume;
  });

  const chartData = Object.entries(volumeByDate)
    .sort(([a], [b]) => new Date(a) - new Date(b))
    .map(([date, volume]) => ({
      date: format(new Date(date), "d MMM"),
      volume: convertWeight(volume)
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

  const totalVolume =
    chartData.reduce(
      (sum, item) => sum + item.volume,
      0
    );

  return (
    <div className="chart-card">

      <h3>Workout Volume Over Time</h3>

      <p className="chart-summary">
        {totalVolume.toFixed(1)} {weightUnit} total volume
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
            stroke="var(--border)"
            strokeDasharray="3 3"
            vertical={false}
          />

          <XAxis
            dataKey="date"
            axisLine={false}
            tickLine={false}
            tick={{
              fill: "var(--text-secondary)",
              fontSize: 13
            }}
          />

          <YAxis
            domain={[
              (min) => min * 0.9,
              (max) => max * 1.1
            ]}
            axisLine={false}
            tickLine={false}
            tick={{
              fill: "var(--text-secondary)",
              fontSize: 13
            }}
            tickFormatter={(value) => value.toFixed(0)}
          />

          <Tooltip
            contentStyle={{
              backgroundColor: "var(--surface)",
              border: "1px solid var(--border)",
              borderRadius: "10px",
              color: "var(--text-primary)"
            }}
            labelStyle={{
              color: "var(--text-primary)"
            }}
            itemStyle={{
              color: "var(--text-primary)"
            }}
            formatter={(value) => [
              `${Number(value).toFixed(1)} ${weightUnit}`,
              "Volume"
            ]}
          />

          <Line
            type="monotone"
            dataKey="volume"
            stroke="var(--primary)"
            strokeWidth={3}
            strokeLinecap="round"
            dot={{ r: 3 }}
            activeDot={{
              r: 6,
              fill: "var(--primary)",
              stroke: "var(--surface)",
              strokeWidth: 2
            }}
          />

        </LineChart>
      </ResponsiveContainer>

    </div>
  );
}

export default VolumeChart;