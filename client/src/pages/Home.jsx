import { useState, useEffect } from "react";
import { useWorkoutContext } from "../hooks/useWorkoutContext";
import { useAuthContext } from "../hooks/useAuthContext";
import { API_BASE_URL } from "../services/api";
import WorkoutDetails from "../components/WorkoutDetails";
import WorkoutForm from "../components/WorkoutForm";
import "./Home.css";

const categories = [
  "All",
  "Chest",
  "Back",
  "Legs",
  "Shoulders",
  "Biceps",
  "Triceps",
  "Core",
  "Cardio"
];

function Home() {
  const { workouts, dispatch } = useWorkoutContext();
  const { user } = useAuthContext();
  const [editingWorkout, setEditingWorkout] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");

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

  const filteredWorkouts = workouts?.filter((workout) => {
    const matchesCategory =
      selectedCategory === "All" ||
      workout.category === selectedCategory;

    const matchesSearch =
      workout.title
        .toLowerCase()
        .includes(searchTerm.toLowerCase());

    return matchesCategory && matchesSearch;
  });

  return (
    <div className="home">
      <div className="left-section">
        <div className="search-bar">
          <input
            type="text"
            placeholder="Search workouts..."
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
          />
        </div>
        <div className="filters">
          {categories.map((category) => (
            <button
              key={category}
              className={selectedCategory === category ? "active" : ""}
              onClick={() => setSelectedCategory(category)}
            >
              {category}
            </button>
          ))}
        </div>
        <div className="workouts">
          {isLoading ? (
            <div className="loading">Loading workouts...</div>
          ) : error ? (
            <div className="error">{error}</div>
          ) : filteredWorkouts?.length === 0 ? (
            <div className="no-workouts">No workouts match your filters.</div>
          ) : (
            filteredWorkouts?.map((workout) => (
              <WorkoutDetails
                key={workout._id}
                workout={workout}
                setEditingWorkout={setEditingWorkout}
              />
            ))
          )}
        </div>
      </div>
      <WorkoutForm
        editingWorkout={editingWorkout}
        setEditingWorkout={setEditingWorkout}
      />
    </div>
  );
}

export default Home;