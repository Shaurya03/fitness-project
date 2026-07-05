import { forwardRef } from "react";
import { format } from "date-fns";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "./DashboardFilter.css";

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

    return `${format(startDate, "dd MMM yyyy")} - ${format(
      endDate,
      "dd MMM yyyy"
    )}`;
  })();

  return (
    <div className="dashboard-filter">

      <div className="filter-period">
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
      </div>

      {selectedPeriod !== "all" &&
        selectedPeriod !== "custom" && (
          <div className="period-navigation">
            <button
              onClick={onPrevious}
            >
              <FaChevronLeft />
            </button>

            <span className="period-label">
              {periodLabel}
            </span>

            <button onClick={onNext}
              disabled={disableNext}
            >
              <FaChevronRight />
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
            popperPlacement="bottom-end"
          />
        </div>
      )}
    </div >
  );
}

export default DashboardFilter;
