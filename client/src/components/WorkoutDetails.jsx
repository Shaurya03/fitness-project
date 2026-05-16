import { useState } from "react";
import { useWorkoutContext } from "../hooks/useWorkoutContext";
import { useAuthContext } from "../hooks/useAuthContext";
import { formatDistanceToNow } from "date-fns";
import { FiEdit, FiTrash2 } from "react-icons/fi";
import { API_BASE_URL } from "../services/api";
import { toast } from "react-toastify";
import "./WorkoutDetails.css";

function WorkoutDetails({ workout, setEditingWorkout }) {
  const { dispatch } = useWorkoutContext();
  const { user } = useAuthContext();
  const [isDeleting, setIsDeleting] = useState(false);

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
      <p className="workout-category">
        {workout.category}
      </p>
      <p>Load: {workout.load} kg</p>
      <p>Reps: {workout.reps}</p>
      <p>
        {formatDistanceToNow(new Date(workout.createdAt), {
          addSuffix: true
        })}
      </p>
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
    </div>
  );
}

export default WorkoutDetails;