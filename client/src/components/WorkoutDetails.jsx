import { useState } from "react";
import { useWorkoutContext } from "../hooks/useWorkoutContext";
import { useAuthContext } from "../hooks/useAuthContext";
import { format } from "date-fns";
import { FiEdit, FiTrash2 } from "react-icons/fi";
import { API_BASE_URL } from "../services/api";
import { toast } from "react-toastify";
import { formatMetric } from "../utils/metricFormatter";
import "./WorkoutDetails.css";

function WorkoutDetails({ workout, setEditingWorkout, preview = false }) {
  const { dispatch } = useWorkoutContext();
  const { user } = useAuthContext();
  const [isDeleting, setIsDeleting] = useState(false);

  const exerciseCount = workout.exercises?.length || 0;

  const formattedDate = format(new Date(workout.date), "EEEE, d MMM yyyy");

  const totalSets =
    workout.exercises?.reduce(
      (total, exercise) =>
        total + (exercise.sets?.length || 0),
      0
    ) || 0;

  const handleDelete = async () => {
    if (!user) {
      return;
    }

    try {
      setIsDeleting(true);

      const response = await fetch(`${API_BASE_URL}/workouts/${workout._id}`, {
        method: "DELETE",
        headers: {
          'Authorization': `Bearer ${user.token}`
        }
      });

      const json = await response.json();

      if (!response.ok) {
        toast.error(json.error || "Failed to delete workout.");
        return;
      }

      dispatch({
        type: 'DELETE_WORKOUT',
        payload: json
      });
      toast.success("Workout deleted successfully!");

    } catch {
      toast.error("An error occurred. Please try again.");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="workout-details">

      <h2>{workout.title}</h2>

      <p>{formattedDate}</p>

      <p>
        {exerciseCount}{" "}
        {exerciseCount === 1 ? "Exercise" : "Exercises"}
        {" • "}
        {totalSets}{" "}
        {totalSets === 1 ? "Set" : "Sets"}
      </p>

      <div className="exercise-list">
        {workout.exercises?.length > 0 ? (
          workout.exercises.map((exercise, index) => (
            <div
              className="exercise-item"
              key={`${exercise.exerciseId?._id}-${index}`}
            >

              <h4>{exercise.exerciseId?.name}</h4>

              <div className="sets-list">

                {exercise.sets?.map((set, setIndex) => (

                  <div
                    key={set._id || setIndex}
                    className="set-item"
                  >

                    <p>Set {setIndex + 1}</p>

                    {Object.entries(set.metrics || {}).map(
                      ([metric, value]) => (

                        <p key={metric}>
                          {formatMetric(metric, value)}
                        </p>
                        
                      )
                    )}

                  </div>

                ))}

              </div>
            </div>
          ))
        ) : (
          <p>No exercises found.</p>
        )}
      </div>

      {!preview && (
        <div className="workout-actions">

          <button className="edit-button"
            onClick={() => setEditingWorkout(workout)}>
            <FiEdit />
          </button>
          <button className="delete-button"
            onClick={handleDelete}
            disabled={isDeleting}>
            {isDeleting ? "Deleting..." : <FiTrash2 />}
          </button>

        </div>
      )}

    </div>
  );
}

export default WorkoutDetails;