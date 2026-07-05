import {
  isSameDay,
  isSameWeek,
  isSameMonth,
  isSameYear,
  isWithinInterval,
  endOfDay
} from "date-fns";

export const filterWorkouts = (
  workouts = [],
  selectedPeriod,
  selectedDate,
  customRange
) => {
  workouts ??= [];

  if (selectedPeriod === "all") {
    return workouts;
  }

  if (selectedPeriod === "day") {
    return workouts.filter(workout =>
      isSameDay(
        new Date(workout.date),
        selectedDate
      )
    );
  }

  if (selectedPeriod === "week") {
    return workouts.filter(workout =>
      isSameWeek(
        new Date(workout.date),
        selectedDate,
        {
          weekStartsOn: 1
        }
      )
    );
  }

  if (selectedPeriod === "month") {
    return workouts.filter(workout =>
      isSameMonth(
        new Date(workout.date),
        selectedDate
      )
    );
  }

  if (selectedPeriod === "year") {
    return workouts.filter(workout =>
      isSameYear(
        new Date(workout.date),
        selectedDate
      )
    );
  }

  if (
    selectedPeriod === "custom" &&
    customRange?.startDate &&
    customRange?.endDate
  ) {
    return workouts.filter(workout =>
      isWithinInterval(
        new Date(workout.date),
        {
          start: new Date(customRange.startDate),
          end: endOfDay(new Date(customRange.endDate))
        }
      )
    );
  }

  return workouts;
};