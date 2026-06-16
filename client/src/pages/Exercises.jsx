import { useEffect, useState } from "react";
import { useExercises } from "../hooks/useExercises";
import ExerciseCard from "../components/ExerciseCard";
import CreateExerciseModal from "../components/CreateExerciseModal";
import EditExerciseModal from "../components/EditExerciseModal";
import DeleteExerciseModal from "../components/DeleteExerciseModal";
import "./Exercises.css";

const categoryOrder = [
  "Chest",
  "Back",
  "Legs",
  "Shoulders",
  "Biceps",
  "Triceps",
  "Forearms",
  "Core",
  "Cardio"
];

function Exercises() {
  const { exercises, fetchExercises, createExercise, updateExercise, deleteExercise } = useExercises();
  const [searchTerm, setSearchTerm] = useState("");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedExercise, setSelectedExercise] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  /* eslint-disable react-hooks/exhaustive-deps */

  useEffect(() => {
    fetchExercises();
  }, []);

  /* eslint-enable react-hooks/exhaustive-deps */

  const filteredExercises = exercises?.filter((exercise) =>
    exercise.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  ) || [];

  const groupedExercises = filteredExercises.reduce(
    (groups, exercise) => {

      const category =
        exercise.type === "cardio"
          ? "Cardio"
          : exercise.category;

      if (!groups[category]) {
        groups[category] = [];
      }

      groups[category].push(exercise);

      return groups;
    }, {}
  );

  const handleEditExercise = (exercise) => {
    setSelectedExercise(exercise);
    setIsEditModalOpen(true);
  };

  const handleSaveExercise = async (updatedName) => {
    await updateExercise(
      selectedExercise._id,
      {
        name: updatedName
      }
    );

    setIsEditModalOpen(false);
    setSelectedExercise(null);
  };

  const handleDeleteExercise = (exercise) => {
    setSelectedExercise(exercise);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!selectedExercise) {
      return;
    }

    await deleteExercise(selectedExercise._id);

    setIsDeleteModalOpen(false);
    setSelectedExercise(null);
  };

  const handleCloseModal = () => {
    setIsCreateModalOpen(false);
    setSelectedCategory(null);
  };

  const handleCreateExercise = async (exerciseName) => {
    await createExercise({
      name: exerciseName,
      type: selectedCategory === "Cardio"
        ? "cardio"
        : "strength",
      category: selectedCategory === "Cardio"
        ? null
        : selectedCategory
    });

    handleCloseModal();
  };

  return (
    <div>
      <h2>Exercises</h2>

      <input
        type="text"
        placeholder="Search exercises..."
        value={searchTerm}
        onChange={(event) =>
          setSearchTerm(event.target.value)
        }
      />

      {categoryOrder.map((category) => {
        const categoryExercises = groupedExercises[category];

        if (!categoryExercises) return null;

        return (
          <div key={category}>

            <div className="category-section">
              <div className="category-header">
                <h3>{category}</h3>
                <button
                  className="category-add-btn"
                  onClick={() => {
                    setSelectedCategory(category);
                    setIsCreateModalOpen(true);
                  }}
                >
                  +
                </button>
              </div>
            </div>

            {categoryExercises.map((exercise) => (
              <ExerciseCard
                key={exercise._id}
                exercise={exercise}
                onEdit={() => handleEditExercise(exercise)}
                onDelete={() => handleDeleteExercise(exercise)}
              />
            ))}

          </div>
        );
      })}

      <CreateExerciseModal
        isOpen={isCreateModalOpen}
        selectedCategory={selectedCategory}
        onClose={handleCloseModal}
        onCreate={handleCreateExercise}
      />

      <EditExerciseModal
        isOpen={isEditModalOpen}
        exercise={selectedExercise}
        onClose={() => {
          setIsEditModalOpen(false)
          setSelectedExercise(null)
        }}
        onSave={handleSaveExercise}
      />

      <DeleteExerciseModal
        isOpen={isDeleteModalOpen}
        exercise={selectedExercise}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setSelectedExercise(null);
        }}
        onDelete={handleConfirmDelete}
      />

    </div>
  );
}

export default Exercises;