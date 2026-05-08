import { useState, useEffect } from "react";
import WorkoutDetails from "../components/WorkoutDetails";
import WorkoutForm from "../components/WorkoutForm";

function Home() {
  const [workouts, setWorkouts] = useState([]);
  const [editingWorkout, setEditingWorkout] = useState(null);

  useEffect(() => {
    const fetchWorkouts = async () => {
      const response = await fetch("http://localhost:5000/api/workouts");
      const json = await response.json();

      if (response.ok) {
        setWorkouts(json);
      }
    };

    fetchWorkouts();
  }, []);

  return (
    <div className="home">
      <div className="workouts">
        {workouts.map((workout) => (
          <WorkoutDetails 
            key={workout._id}
            workout={workout} 
            setWorkouts={setWorkouts}
            setEditingWorkout={setEditingWorkout}
          />
        ))}
      </div>
      <WorkoutForm 
        setWorkouts={setWorkouts}
        editingWorkout={editingWorkout}
      />
    </div>
      );
}

      export default Home;