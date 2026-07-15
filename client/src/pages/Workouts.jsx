import { useState, useMemo } from "react";
import {
  format,
  addDays,
  subDays,
  isSameDay
} from "date-fns";
import { useNavigate } from "react-router-dom";
import { useWorkoutContext } from "../hooks/useWorkoutContext";
import { FiChevronLeft, FiChevronRight, FiCalendar } from "react-icons/fi";
import { getWorkoutHistoryWithPRs } from "../utils/workoutPRHistory";
import { useLocation } from "react-router-dom";
import WorkoutDetails from "../components/WorkoutDetails";
import WorkoutCalendarModal from "../components/WorkoutCalendarModal";
import "./Workouts.css";

function Workouts() {
  const {
    workouts,
    isLoading,
    error
  } = useWorkoutContext();

  const navigate = useNavigate();

  const location = useLocation();

  const [selectedDate, setSelectedDate] = useState(
    location.state?.selectedDate
      ? new Date(location.state.selectedDate)
      : new Date()
  );

  const [isCalendarOpen, setIsCalendarOpen] = useState(false);

  const workoutsWithPRs = useMemo(
    () => getWorkoutHistoryWithPRs(workouts),
    [workouts]
  );

  const currentWorkout =
    workoutsWithPRs.find(workout =>
      isSameDay(
        new Date(workout.date),
        selectedDate
      )
    );

  const handleExerciseClick = (workout, exercise) => {
    navigate("/exercises", {
      state: {
        selectedExerciseId: exercise.exerciseId._id,
        workoutId: workout._id,
        workoutDate: workout.date
      }
    });
  };

  const handlePrevious = () => {
    setSelectedDate(date =>
      subDays(date, 1)
    );
  };

  const handleNext = () => {

    const today = new Date();

    setSelectedDate(date => {
      const nextDate = addDays(date, 1);

      return nextDate > today
        ? date
        : nextDate;
    });
  };

  if (isLoading) {
    return (
      <div className="workouts-page">
        <div className="loading">
          Loading workouts...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="workouts-page">
        <div className="error">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="workouts-page">

      <div className="page-header">
        <h2>Workouts</h2>
      </div>

      <div className="workout-navigation">

        <button
          onClick={handlePrevious}
          className="nav-btn"
        >
          <FiChevronLeft />
        </button>

        <h3 className="workout-date">
          {format(
            selectedDate,
            "EEEE, d MMM yyyy"
          )}
        </h3>

        <button
          className="nav-btn"
          onClick={() => setIsCalendarOpen(true)}
        >
          <FiCalendar />
        </button>

        <button
          onClick={handleNext}
          className="nav-btn"
          disabled={isSameDay(selectedDate, new Date())}
        >
          <FiChevronRight />
        </button>

      </div>

      {!currentWorkout ? (

        <div className="empty-workout-log">

          <h2>No workout logged</h2>

          <p>
            Start today's workout.
          </p>

          <button
            className="primary-btn"
            onClick={() => navigate("/exercises")}
          >
            Start Workout
          </button>

        </div>

      ) : (

        <WorkoutDetails
          workout={currentWorkout}
          onSelectedExercise={handleExerciseClick}
        />
      )}

      <WorkoutCalendarModal
        isOpen={isCalendarOpen}
        workouts={workoutsWithPRs}
        onSelectWorkoutDate={(date) => {
          setSelectedDate(date);
          setIsCalendarOpen(false);
        }}
        onClose={() => setIsCalendarOpen(false)}
      />

    </div>

  );
}

export default Workouts;