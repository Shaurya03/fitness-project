function DashboardFilter({
  selectedPeriod,
  onPeriodChange,
  periodLabel,
  onPrevious,
  onNext,
  disableNext,
  customRange,
  setCustomRange
}) {
  return (
    <div className="dashboard-filter">
      <select
        value={selectedPeriod}
        onChange={(event) => onPeriodChange(event.target.value)}
      >
        <option value="day">Day</option>
        <option value="week">Week</option>
        <option value="month">Month</option>
        <option value="year">Year</option>
        <option value="all">All Time</option>
        <option value="custom">Custom</option>
      </select>

      {selectedPeriod !== "all" &&
        selectedPeriod !== "custom" && (
          <div className="period-navigation">
            <button
              onClick={onPrevious}
            >
              {"<"}
            </button>

            <span>{periodLabel}</span>

            <button onClick={onNext}
              disabled={disableNext}
            >
              {">"}
            </button>
          </div>
        )}

      {selectedPeriod === "custom" && (
        <div className="period-navigation">
          <input
            type="date"
            value={customRange.startDate || ""}
            onChange={(event) =>
              setCustomRange(range => ({
                ...range,
                startDate: event.target.value
              }))
            }
          />

          <input
            type="date"
            min={customRange.startDate}
            value={customRange.endDate || ""}
            onChange={(event) =>
              setCustomRange(range => ({
                ...range,
                endDate: event.target.value
              }))
            }
          />
        </div>
      )}
    </div>
  );
}

export default DashboardFilter;
