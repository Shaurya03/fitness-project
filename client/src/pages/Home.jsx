import { useState, useEffect } from "react";
import { useWorkoutContext } from "../hooks/useWorkoutContext";
import { useAuthContext } from "../hooks/useAuthContext";
import { API_BASE_URL } from "../services/api";
import WorkoutDetails from "../components/WorkoutDetails";
import WorkoutForm from "../components/WorkoutForm";
import "./Home.css";

function Home() {
  const { workouts, dispatch } = useWorkoutContext();
  const { user } = useAuthContext();
  const [editingWorkout, setEditingWorkout] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!user) {
      return;
    }
    const fetchWorkouts = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await fetch(`${API_BASE_URL}/workouts`, {
          headers: {
            'Authorization': `Bearer ${user.token}`
          }
        });
        const json = await response.json();

        if (!response.ok) {
          setError(json.error || "Failed to fetch workouts.");
          return;
        }

        dispatch({
          type: 'SET_WORKOUTS',
          payload: json
        });

      } catch {
        setError("An error occurred. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchWorkouts();
  }, [dispatch, user]);

  return (
    <div className="home">
      <div className="workouts">
        {isLoading ? (
          <div className="loading">Loading workouts...</div>
        ) : error ? (
          <div className="error">{error}</div>
        ) : workouts?.length === 0 ? (
          <div className="no-workouts">No workouts found. Start by adding one!</div>
        ) : (
          workouts?.map((workout) => (
            <WorkoutDetails
              key={workout._id}
              workout={workout}
              setEditingWorkout={setEditingWorkout}
            />
          ))
        )}
      </div>
      <WorkoutForm
        editingWorkout={editingWorkout}
        setEditingWorkout={setEditingWorkout}
      />
    </div>
  );
}

export default Home;