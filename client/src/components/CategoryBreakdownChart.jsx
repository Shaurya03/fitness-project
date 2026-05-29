import { useState } from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Label
} from "recharts";
import './CategoryBreakdownChart.css';

const categoryColors = {
  Chest: "#EF4444",
  Back: "#3B82F6",
  Legs: "#F59E0B",
  Shoulders: "#A855F7",
  Biceps: "#10B981",
  Triceps: "#14B8A6",
  Forearms: "#6366F1",
  Cardio: "#EC4899"
};

function CategoryBreakdownChart({ workouts }) {
  const categoryTotals = {};

  workouts?.forEach(workout => {
    workout.exercises?.forEach(exercise => {
      const category =
        exercise.type === "cardio"
          ? "Cardio"
          : exercise.category;

      const setCount =
        exercise.type === "cardio"
          ? 1
          : exercise.sets?.length || 0;

      categoryTotals[category] =
        (categoryTotals[category] || 0) + setCount;

    });
  });

  const chartData = Object.entries(categoryTotals)
    .map(([name, value]) => ({
      name,
      value
    }))
    .sort((a, b) => b.value - a.value);

  const [activeCategory, setActiveCategory] = useState(null);

  const displayedCategory = activeCategory || chartData[0];

  const totalSets = chartData.reduce((sum, item) =>
    sum + item.value, 0
  );

  if (chartData.length === 0) {
    return (
      <div className="chart-card">
        <h3>Category Breakdown</h3>
        <div className="chart-empty">
          No workout data available yet.
        </div>
      </div>
    );
  }

  return (
    <div className="chart-card">
      <h3>Category Breakdown</h3>
      <p className="chart-summary">
        {totalSets} total {totalSets === 1 ? "set" : "sets"}
      </p>

      <ResponsiveContainer
        width="100%"
        height={350}
      >
        <PieChart>
          <Pie
            data={chartData}
            dataKey="value"
            nameKey="name"
            innerRadius={70}
            outerRadius={120}
            paddingAngle={2}
            onMouseEnter={(_, index) =>
              setActiveCategory(chartData[index])
            }
            onMouseLeave={() =>
              setActiveCategory(null)
            }
          >
            {
              chartData.map((entry) => (
                <Cell
                  key={entry.name}
                  fill={
                    categoryColors[entry.name] || "#999"
                  }
                />
              ))
            }
            <Label
              position="center"
              content={() => {
                if (!displayedCategory) return null;

                return (
                  <text
                    x="50%"
                    y="50%"
                    textAnchor="middle"
                    dominantBaseline="middle"
                  >
                    <tspan
                      x="50%"
                      dy="-10"
                      fontSize="20"
                      fontWeight="700"
                    >
                      {displayedCategory.name}
                    </tspan>

                    <tspan
                      x="50%"
                      dy="24"
                      fontSize="14"
                      fill="#666"
                    >
                      {(
                        (displayedCategory.value / totalSets) * 100
                      ).toFixed(1)}
                      %
                    </tspan>
                  </text>
                );
              }}
            />
          </Pie>
          <Tooltip
            formatter={(value, name) => [
              name === "Cardio"
                ? `${value} ${value === 1 ? "session" : "sessions"}`
                : `${value} ${value === 1 ? "set" : "sets"}`,
              name
            ]}
          />
        </PieChart>
      </ResponsiveContainer>

      <div className="category-breakdown-list">
        {chartData.map((item) => (
          <div
            key={item.name}
            className="category-breakdown-item"
          >
            <div className="category-info">
              <span
                className="color-dot"
                style={{
                  backgroundColor: categoryColors[item.name] || "#999"
                }}
              />
              <span>{item.name}</span>
            </div>

            <div className="category-breakdown-stats">
              <span>{item.value}{" "}
                {item.name === "Cardio"
                  ? `${item.value === 1 ? "session" : "sessions"}`
                  : `${item.value === 1 ? "set" : "sets"}`
                }
              </span>

              <span>
                {(
                  (item.value / totalSets) * 100
                ).toFixed(1)}
                %
              </span>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
}


export default CategoryBreakdownChart;