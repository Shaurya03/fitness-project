import { useState } from "react";
import { useWorkoutContext } from "../hooks/useWorkoutContext";
import { useAuthContext } from "../hooks/useAuthContext";
import { API_BASE_URL } from "../services/api";
import { toast } from "react-toastify";
import { useCategories } from "../hooks/useCategories";
import WorkoutDetails from "../components/WorkoutDetails";
import WorkoutForm from "../components/WorkoutForm";
import DeleteWorkoutModal from "../components/DeleteWorkoutModal";
import "./Workouts.css";

function Workouts() {
  const { workouts, isLoading, error, dispatch } = useWorkoutContext();
  const { user } = useAuthContext();
  const [editingWorkout, setEditingWorkout] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedWorkout, setSelectedWorkout] = useState(null);

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

  const handleDeleteClick = (workout) => {
    setSelectedWorkout(workout);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {

    if (!selectedWorkout || !user) {
      return;
    }

    try {
      const response = await fetch(
        `${API_BASE_URL}/workouts/${selectedWorkout._id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${user.token}`
          }
        }
      );

      const json = await response.json();

      if (!response.ok) {
        toast.error(json.error);
        return;
      }

      dispatch({
        type: "DELETE_WORKOUT",
        payload: json
      });

      toast.success("Workout deleted successfully!");

      setIsDeleteModalOpen(false);
      setSelectedWorkout(null);

    } catch {
      toast.error("An error occurred. Please try again.");
    }
  };

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
                onDelete={() => handleDeleteClick(workout)}
              />
            ))
          )}
        </div>
      </div>
      <WorkoutForm
        editingWorkout={editingWorkout}
        setEditingWorkout={setEditingWorkout}
      />

      <DeleteWorkoutModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setSelectedWorkout(null);
        }}
        onDelete={handleConfirmDelete}
      />
    </div>
  );
}

export default Workouts;