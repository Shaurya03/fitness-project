import { useState, useEffect } from "react";
import WorkoutDetails from "../components/WorkoutDetails";

function Home() {
  const [workouts, setWorkouts] = useState([]);

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
    <div>
      <h1>Home Page</h1>

      {workouts.map((workout) => (
        <WorkoutDetails key={workout._id} workout={workout} />
      ))}
    </div>
  );
}

export default Home;