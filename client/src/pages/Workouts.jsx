import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useWorkoutContext } from "../hooks/useWorkoutContext";
import WorkoutDetails from "../components/WorkoutDetails";
import DeleteWorkoutModal from "../components/DeleteWorkoutModal";
import "./Workouts.css";

function Workouts() {
  const {
    workouts,
    isLoading,
    error
  } = useWorkoutContext();

  const navigate = useNavigate();

  const [isDeleteModalOpen, setIsDeleteModalOpen] =
    useState(false);

  const [selectedWorkout, setSelectedWorkout] =
    useState(null);

  const handleDeleteClick = (workout) => {
    setSelectedWorkout(workout);
    setIsDeleteModalOpen(true);
  };

  return (
    <div className="workouts-page">

      <div className="page-header">
        <h2>Workouts</h2>

        <button
          className="primary-btn"
          onClick={() => navigate("/exercises")}
        >
          Create Workout
        </button>
      </div>

      {isLoading ? (
        <div className="loading">
          Loading workouts...
        </div>

      ) : error ? (
        <div className="error">
          {error}
        </div>

      ) : workouts.length === 0 ? (
        <div className="empty-state">

          <p>No workouts yet.</p>

          <button
            className="primary-btn"
            onClick={() => navigate("/exercises")}
          >
            Create your first workout
          </button>

        </div>

      ) : (

        <div className="workouts">

          {workouts.map(workout => (

            <WorkoutDetails
              key={workout._id}
              workout={workout}
              onDelete={() =>
                handleDeleteClick(workout)
              }
            />

          ))}

        </div>

      )}

      <DeleteWorkoutModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setSelectedWorkout(null);
        }}
        onDelete={() => { }}
      />

    </div>
  );
}

export default Workouts;