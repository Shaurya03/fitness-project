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
      />

      <Sector
        cx={cx}
        cy={cy}
        innerRadius={innerRadius}
        outerRadius={outerRadius}
        startAngle={startAngle}
        endAngle={endAngle}
        fill={fill}
      />
    </g>
  );
};

function CategoryBreakdownChart({ workouts }) {
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

      categoryTotals[category._id].value +=
        exercise.sets?.length || 0;

    });
  });

  const chartData = Object.values(categoryTotals)
    .sort((a, b) => b.value - a.value);

  const [activeCategory, setActiveCategory] = useState(null);
  const [activeIndex, setActiveIndex] = useState(-1);

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
              <span>{item.value}{" "}
                {item.value === 1 ? "set" : "sets"}
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