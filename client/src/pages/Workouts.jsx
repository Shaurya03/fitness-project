import { useState, useMemo } from "react";
import {
  format,
  addDays,
  subDays,
  isSameDay
} from "date-fns";
import { useNavigate } from "react-router-dom";
import { useWorkoutContext } from "../hooks/useWorkoutContext";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { getWorkoutHistoryWithPRs } from "../utils/workoutPRHistory";
import WorkoutDetails from "../components/WorkoutDetails";
import "./Workouts.css";

function Workouts() {
  const {
    workouts,
    isLoading,
    error
  } = useWorkoutContext();

  const navigate = useNavigate();

  const [selectedDate, setSelectedDate] =
    useState(new Date());

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
        workoutId: workout._id
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

    if (isLoading) {
      return <div className="loading">Loading workouts...</div>;
    }

    if (error) {
      return <div className="error">{error}</div>;
    }

  };

  return (
    <div className="workouts-page">

      <div className="page-header">
        <h2>Workouts</h2>
      </div>

      <div className="workout-navigation">

        <button
          onClick={handlePrevious}
        >
          <FiChevronLeft />
        </button>

        <span>
          {format(
            selectedDate,
            "EEEE, d MMM yyyy"
          )}
        </span>

        <button
          onClick={handleNext}
          disabled={
            isSameDay(
              selectedDate,
              new Date()
            )
          }
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

    </div>
  );
}

export default Workouts;