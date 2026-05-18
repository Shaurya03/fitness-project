import { useState } from "react";
import { useWorkoutContext } from "../hooks/useWorkoutContext";
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
  const { workouts, isLoading, error } = useWorkoutContext();
  const [editingWorkout, setEditingWorkout] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");

  const filteredWorkouts = workouts?.filter((workout) => {
    const matchesCategory =
      selectedCategory === "All" ||
      workout.category === selectedCategory;

    const matchesSearch =
      workout.title
        .toLowerCase()
        .includes(searchTerm.toLowerCase());

    return matchesCategory && matchesSearch;
  }) || [];

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
          ) : filteredWorkouts.length === 0 ? (
            <div className="no-workouts">No workouts match your filters.</div>
          ) : (
            filteredWorkouts.map((workout) => (
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