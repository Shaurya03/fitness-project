import { useState, useEffect } from "react";
import { useWorkoutContext } from "../hooks/useWorkoutContext";
import WorkoutDetails from "../components/WorkoutDetails";
import WorkoutForm from "../components/WorkoutForm";
import "./Home.css";

function Home() {
  const { workouts, dispatch } = useWorkoutContext();
  const [editingWorkout, setEditingWorkout] = useState(null);

  useEffect(() => {
    const fetchWorkouts = async () => {
      const response = await fetch("http://localhost:5000/api/workouts");
      const json = await response.json();

      if (response.ok) {
        dispatch({
          type: 'SET_WORKOUTS',
          payload: json
        });
      }
    };

    fetchWorkouts();
  }, [dispatch]);

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