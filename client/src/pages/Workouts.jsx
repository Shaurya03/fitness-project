import { useState } from "react";
import { useWorkoutContext } from "../hooks/useWorkoutContext";
import { useCategories } from "../hooks/useCategories";
import WorkoutDetails from "../components/WorkoutDetails";
import WorkoutForm from "../components/WorkoutForm";
import "./Workouts.css";

function Workouts() {
  const { workouts, isLoading, error } = useWorkoutContext();
  const [editingWorkout, setEditingWorkout] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const { categories } = useCategories();

  const filterCategories = [
    {
      _id: "all",
      name: "All"
    },

    ...(categories || [])
  ];

  const categoryMap = Object.fromEntries(
    (categories || []).map(category => [
      category._id,
      category.name
    ])
  );

  const filteredWorkouts = workouts?.filter((workout) => {
    const matchesCategory =
      selectedCategory === "All" ||
      workout.exercises?.some(
        exercise =>
          categoryMap[exercise.categoryId] === selectedCategory
      );

    const normalizedSearch = searchTerm.toLowerCase();

    const matchesSearch =
      workout.title
        .toLowerCase()
        .includes(normalizedSearch) ||

      workout.exercises?.some(
        exercise =>
          exercise.exerciseId?.name
            ?.toLowerCase()
            ?.includes(normalizedSearch) ||

          categoryMap[exercise.categoryId]
            ?.toLowerCase()
            .includes(normalizedSearch)
      );

    return matchesCategory && matchesSearch;
  }) || [];

  return (
    <div className="workouts-page">
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
          {filterCategories.map((category) => (
            <button
              key={category._id}
              className={selectedCategory === category.name ? "active" : ""}
              onClick={() => setSelectedCategory(category.name)}
            >
              {category.name}
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

export default Workouts;