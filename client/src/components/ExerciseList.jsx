import { useState } from "react";
import ExerciseCard from "./ExerciseCard";
import CreateExerciseModal from "./CreateExerciseModal";
import EditExerciseModal from "./EditExerciseModal";
import DeleteExerciseModal from "./DeleteExerciseModal";
import ExerciseHistoryModal from "./ExerciseHistoryModal";

function ExerciseList({
  category,
  categories,
  exercises,
  createExercise,
  updateExercise,
  deleteExercise,
  searchTerm,
  setSearchTerm,
  onBack,
  onSelectExercise
}) {

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const [selectedExercise, setSelectedExercise] = useState(null);
  const [historyExercise, setHistoryExercise] = useState(null);

  const filteredExercises = exercises.filter(
    exercise =>
      exercise.categoryId?._id === category._id &&
      exercise.name
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
  );

  const handleCreateExercise = async (exerciseData) => {
    await createExercise({
      ...exerciseData,
      categoryId: category._id
    });

    setIsCreateModalOpen(false);
  };

  const handleEditExercise = (exercise) => {
    setSelectedExercise(exercise);
    setIsEditModalOpen(true);
  };

  const handleSaveExercise = async (exerciseData) => {

    await updateExercise(
      selectedExercise._id,
      exerciseData
    );

    setSelectedExercise(null);
    setIsEditModalOpen(false);
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

    setSelectedExercise(null);
    setIsDeleteModalOpen(false);
  };

  return (
    <div className="exercise-list">

      <div className="page-header">

        <button
          className="back-btn"
          onClick={onBack}
        >
          ← Back
        </button>

        <h2>{category.name}</h2>

        <button
          className="add-category-btn"
          onClick={() =>
            setIsCreateModalOpen(true)
          }
        >
          + Exercise
        </button>

      </div>

      <input
        className="search-input"
        type="text"
        placeholder="Search exercises..."
        value={searchTerm}
        onChange={(event) =>
          setSearchTerm(event.target.value)
        }
      />

      {filteredExercises.map((exercise) => (

        <ExerciseCard
          key={exercise._id}
          mode="manage"
          exercise={exercise}
          onClick={() =>
            onSelectExercise(exercise)
          }
          onHistory={() =>
            setHistoryExercise(exercise)
          }
          onEdit={() =>
            handleEditExercise(exercise)
          }
          onDelete={() =>
            handleDeleteExercise(exercise)
          }
        />

      ))}

      <CreateExerciseModal
        isOpen={isCreateModalOpen}
        selectedCategory={category}
        onClose={() =>
          setIsCreateModalOpen(false)
        }
        onCreate={handleCreateExercise}
      />

      <EditExerciseModal
        isOpen={isEditModalOpen}
        exercise={selectedExercise}
        categories={categories}
        onClose={() => {
          setSelectedExercise(null);
          setIsEditModalOpen(false);
        }}
        onSave={handleSaveExercise}
      />

      <DeleteExerciseModal
        isOpen={isDeleteModalOpen}
        exercise={selectedExercise}
        onClose={() => {
          setSelectedExercise(null);
          setIsDeleteModalOpen(false);
        }}
        onDelete={handleConfirmDelete}
      />

      <ExerciseHistoryModal
        exerciseId={historyExercise?._id}
        isOpen={historyExercise !== null}
        onClose={() =>
          setHistoryExercise(null)
        }
      />

    </div>
  );
}

export default ExerciseList;