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

  useEffect(() => {
    if (!user) {
      return;
    }
    const fetchWorkouts = async () => {
      const response = await fetch(`${API_BASE_URL}/workouts`, {
        headers: {
          'Authorization': `Bearer ${user.token}`
        }
      });
      const json = await response.json();

      if (response.ok) {
        dispatch({
          type: 'SET_WORKOUTS',
          payload: json
        });
      }
    };

    fetchWorkouts();
  }, [dispatch, user]);

  return (
    <div className="home">
      <div className="workouts">
        {workouts?.map((workout) => (
          <WorkoutDetails
            key={workout._id}
            workout={workout}
            setEditingWorkout={setEditingWorkout}
          />
        ))}
      </div>
      <WorkoutForm
        editingWorkout={editingWorkout}
        setEditingWorkout={setEditingWorkout}
      />
    </div>
  );
}

export default Home;