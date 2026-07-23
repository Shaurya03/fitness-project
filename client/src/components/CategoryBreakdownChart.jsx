import { useState } from "react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Label,
  Sector
} from "recharts";
import './DashboardCharts.css';

const metricLabels = {
  sets: {
    singular: "set",
    plural: "sets",
    total: "total sets"
  },
  reps: {
    singular: "rep",
    plural: "reps",
    total: "total reps"
  },
  volume: {
    singular: "kg",
    plural: "kg",
    total: "kg total volume"
  }
};

const renderActiveShape = (props) => {
  const {
    cx,
    cy,
    innerRadius,
    outerRadius,
    startAngle,
    endAngle,
    fill
  } = props;

  return (
    <g>
      <Sector
        cx={cx}
        cy={cy}
        innerRadius={innerRadius}
        outerRadius={outerRadius + 8}
        startAngle={startAngle}
        endAngle={endAngle}
        fill={fill}
        opacity={0.4}
        stroke="none"
      />

      <Sector
        cx={cx}
        cy={cy}
        innerRadius={innerRadius}
        outerRadius={outerRadius}
        startAngle={startAngle}
        endAngle={endAngle}
        fill={fill}
        stroke="var(--surface)"
        strokeWidth={2}
      />
    </g>
  );
};

function CategoryBreakdownChart({ workouts }) {

  const [metric, setMetric] = useState("sets");

  const categoryTotals = {};

  workouts?.forEach(workout => {
    workout.exercises?.forEach(exercise => {

      const category = exercise.exerciseId?.categoryId;

      if (!category) {
        return;
      }

      if (!categoryTotals[category._id]) {
        categoryTotals[category._id] = {
          name: category.name,
          color: category.color,
          value: 0
        };
      }

      switch (metric) {
        case "reps":
          categoryTotals[category._id].value +=
            exercise.sets?.reduce(
              (sum, set) => sum + (set.metrics?.reps || 0),
              0
            );
          break;

        case "volume":
          categoryTotals[category._id].value +=
            exercise.sets?.reduce(
              (sum, set) =>
                sum +
                ((set.metrics?.weight || 0) *
                  (set.metrics?.reps || 0)),
              0
            );
          break;

        default:
          categoryTotals[category._id].value +=
            exercise.sets?.length || 0;
      }

    });
  });

  const chartData = Object.values(categoryTotals)
    .filter(category => category.value > 0)
    .sort((a, b) => b.value - a.value);

  const [activeCategory, setActiveCategory] = useState(null);
  const [activeIndex, setActiveIndex] = useState(-1);

  const displayedCategory = activeCategory || chartData[0];

  const totalValue = chartData.reduce(
    (sum, item) => sum + item.value,
    0
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

      <div className="chart-toggle">

        <button
          className={metric === "sets" ? "active" : ""}
          onClick={() => setMetric("sets")}
        >
          Sets
        </button>

        <button
          className={metric === "reps" ? "active" : ""}
          onClick={() => setMetric("reps")}
        >
          Reps
        </button>

        <button
          className={metric === "volume" ? "active" : ""}
          onClick={() => setMetric("volume")}
        >
          Volume
        </button>

      </div>

      <p className="chart-summary">
        {totalValue} {metricLabels[metric].total}
      </p>

      <ResponsiveContainer
        width="100%"
        height={260}
      >
        <PieChart>
          <Pie
            data={chartData}
            dataKey="value"
            nameKey="name"
            innerRadius={70}
            outerRadius={120}
            paddingAngle={2}
            stroke="var(--surface)"
            strokeWidth={2}
            onMouseEnter={(_, index) => {
              setActiveCategory(chartData[index])
              setActiveIndex(index)
            }}
            onMouseLeave={() => {
              setActiveCategory(null)
              setActiveIndex(-1)
            }}
            activeIndex={activeIndex}
            activeShape={renderActiveShape}
          >
            {
              chartData.map((entry) => (
                <Cell
                  key={entry.name}
                  fill={entry.color}
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
                      fill="var(--text-primary)"
                    >
                      {displayedCategory.name}
                    </tspan>

                    <tspan
                      x="50%"
                      dy="24"
                      fontSize="14"
                      fill="var(--text-secondary)"
                    >
                      {(
                        (displayedCategory.value / totalValue) * 100
                      ).toFixed(1)}
                      %
                    </tspan>
                  </text>
                );
              }}
            />
          </Pie>
        </PieChart>
      </ResponsiveContainer>

      <div className="category-breakdown-list">
        {chartData.map((item, index) => (
          <div
            key={item.name}
            className="category-breakdown-item"
            onMouseEnter={() => {
              setActiveCategory(item);
              setActiveIndex(index);
            }}
            onMouseLeave={() => {
              setActiveCategory(null);
              setActiveIndex(-1);
            }}
          >
            <div className="category-info">
              <span
                className="color-dot"
                style={{
                  backgroundColor: item.color
                }}
              />
              <span>{item.name}</span>
            </div>

            <div className="category-breakdown-stats">
              <span>
                {metric === "volume"
                  ? `${item.value.toFixed(1)} kg`
                  : `${item.value} ${item.value === 1
                    ? metricLabels[metric].singular
                    : metricLabels[metric].plural
                  }`}
              </span>

              <span>
                {(
                  (item.value / totalValue) * 100
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