import {
  format,

  isToday,
  isYesterday,
  isThisWeek,
  isThisMonth,
  isThisYear,

  startOfWeek,
  endOfWeek,

  subDays,
  subWeeks,
  subMonths,
  subYears,

  addDays,
  addWeeks,
  addMonths,
  addYears,
} from "date-fns";

export const getPeriodLabel = (selectedPeriod, selectedDate) => {
  switch (selectedPeriod) {

    case "day":
      if (isToday(selectedDate)) {
        return "Today";
      }

      if (isYesterday(selectedDate)) {
        return "Yesterday";
      }

      return format(selectedDate, "d MMM yyyy");

    case "week": {
      if (isThisWeek(selectedDate, { weekStartsOn: 1 })) {
        return "This Week";
      }

      const start = startOfWeek(selectedDate, {
        weekStartsOn: 1,
      });

      const end = endOfWeek(selectedDate, {
        weekStartsOn: 1,
      });

      return `${format(start, "d MMM")} - ${format(end, "d MMM")}`;
    }

    case "month":
      if (isThisMonth(selectedDate)) {
        return "This Month";
      }

      return format(selectedDate, "MMMM yyyy");

    case "year":
      if (isThisYear(selectedDate)) {
        return "This Year";
      }

      return format(selectedDate, "yyyy");


    case "all":
      return "All Time";


    case "custom":
      return "Custom Range";

    default:
      return "";
  }
};

export const getDisableNext = (selectedPeriod, selectedDate) => {
  switch (selectedPeriod) {

    case "day":
      return isToday(selectedDate);

    case "week":
      return isThisWeek(
        selectedDate,
        { weekStartsOn: 1 }
      );

    case "month":
      return isThisMonth(selectedDate);

    case "year":
      return isThisYear(selectedDate);

    default:
      return true;
  }
};

export const getPreviousPeriodDate = (selectedPeriod, selectedDate) => {
  switch (selectedPeriod) {

    case "day":
      return subDays(selectedDate, 1);

    case "week":
      return subWeeks(selectedDate, 1);

    case "month":
      return subMonths(selectedDate, 1);

    case "year":
      return subYears(selectedDate, 1);

    default:
      return selectedDate;
  }
};

export const getNextPeriodDate = (selectedPeriod, selectedDate) => {
  switch (selectedPeriod) {

    case "day":
      return addDays(selectedDate, 1);

    case "week":
      return addWeeks(selectedDate, 1);

    case "month":
      return addMonths(selectedDate, 1);

    case "year":
      return addYears(selectedDate, 1);

    default:
      return selectedDate;
  }
};