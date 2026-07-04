import { forwardRef } from "react";
import { format } from "date-fns";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const DateButton = forwardRef(({ label, onClick }, ref) => (
  <button
    ref={ref}
    type="button"
    className="date-display"
    onClick={onClick}
  >
    {label}
  </button>
));

DateButton.displayName = "DateButton";

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

  const rangeLabel = (() => {
    const { startDate, endDate } = customRange;

    if (!startDate) {
      return "Select Date Range";
    }

    if (!endDate) {
      return `${format(startDate, "dd MMM yyyy")} to ...`;
    }

    return `${format(startDate, "dd MMM yyyy")} to ${format(
      endDate,
      "dd MMM yyyy"
    )}`;
  })();

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
          <DatePicker
            selectsRange
            startDate={customRange.startDate}
            endDate={customRange.endDate}
            onChange={([startDate, endDate]) =>
              setCustomRange({
                startDate,
                endDate
              })
            }
            customInput={<DateButton label={rangeLabel} />}
            dateFormat="dd MMM yyyy"
            shouldCloseOnSelect={false}
            popperPlacement="bottom-start"
          />
        </div>
      )}
    </div >
  );
}

export default DashboardFilter;
