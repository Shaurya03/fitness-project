import { useWorkoutContext } from "../hooks/useWorkoutContext";
import { formatDistanceToNow } from "date-fns";
import "./WorkoutDetails.css";

function WorkoutDetails({ workout, setEditingWorkout }) {
  const { dispatch } = useWorkoutContext();

  const handleDelete = async () => {
    const response = await fetch(`http://localhost:5000/api/workouts/${workout._id}`, {
      method: "DELETE"
    });

    const json = await response.json();

    if (response.ok) {
      dispatch({
        type: 'DELETE_WORKOUT',
        payload: json
      });
    }
  };

  return (
    <div className="workout-details">
      <h2>{workout.title}</h2>
      <p>Load: {workout.load} kg</p>
      <p>Reps: {workout.reps}</p>
      <p>
        {formatDistanceToNow(new Date(workout.createdAt), {
          addSuffix: true 
        })}
      </p>
      <button onClick={() => setEditingWorkout(workout)}>Edit</button>
      <button onClick={handleDelete}>Delete</button>
    </div>
  );
}

export default WorkoutDetails;