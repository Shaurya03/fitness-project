import { useState } from "react";
import { format } from "date-fns";
import { useNavigate } from "react-router-dom";
import { useWorkoutContext } from "../hooks/useWorkoutContext";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import WorkoutDetails from "../components/WorkoutDetails";
import "./Workouts.css";

function Workouts() {
  const {
    workouts,
    isLoading,
    error
  } = useWorkoutContext();

  const navigate = useNavigate();

  const [currentWorkoutIndex, setCurrentWorkoutIndex] =
    useState(0);

  const sortedWorkouts = [...workouts].sort(
    (a, b) => new Date(b.date) - new Date(a.date)
  );

  const currentWorkout =
    sortedWorkouts[currentWorkoutIndex];

  const handleExerciseClick = (workout, exercise) => {
    navigate("/exercises", {
      state: {
        selectedExerciseId: exercise.exerciseId._id,
        workoutId: workout._id
      }
    });
  };

  const handlePrevious = () => {
    setCurrentWorkoutIndex(index =>
      Math.min(index + 1, sortedWorkouts.length - 1)
    );
  };

  const handleNext = () => {
    setCurrentWorkoutIndex(index =>
      Math.max(index - 1, 0)
    );
  };

  return (
    <div className="workouts-page">

      <div className="page-header">
        <h2>Workouts</h2>
      </div>

      {isLoading ? (
        <div className="loading">
          Loading workouts...
        </div>

      ) : error ? (
        <div className="error">
          {error}
        </div>

      ) : sortedWorkouts.length === 0 ? (

        <div className="empty-workout-log">

          <h2>Workout Log</h2>

          <p>
            Your workout log is empty.
          </p>

          <button
            className="primary-btn"
            onClick={() => navigate("/exercises")}
          >
            Start Workout
          </button>

        </div>

      ) : (

        <>
          <div className="workout-navigation">

            <button
              onClick={handlePrevious}
              disabled={
                currentWorkoutIndex ===
                sortedWorkouts.length - 1
              }
            >
              <FiChevronLeft />
            </button>

            {currentWorkout && (
              <span>
                {format(
                  new Date(currentWorkout.date),
                  "EEEE, d MMM yyyy"
                )}
              </span>
            )}

            <button
              onClick={handleNext}
              disabled={currentWorkoutIndex === 0}
            >
              <FiChevronRight />
            </button>

          </div>

          <WorkoutDetails
            workout={currentWorkout}
            onSelectedExercise={handleExerciseClick}
          />
        </>
      )}

    </div>
  );
}

export default Workouts;