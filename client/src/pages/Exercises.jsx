import { useEffect, useState, useRef } from "react";
import { useCategories } from "../hooks/useCategories";
import { useExercises } from "../hooks/useExercises";
import CategoryHeader from "../components/CategoryHeader";
import ExerciseCard from "../components/ExerciseCard";
import CreateExerciseModal from "../components/CreateExerciseModal";
import EditExerciseModal from "../components/EditExerciseModal";
import DeleteExerciseModal from "../components/DeleteExerciseModal";
import CreateCategoryModal from "../components/CreateCategoryModal";
import EditCategoryModal from "../components/EditCategoryModal";
import DeleteCategoryModal from "../components/DeleteCategoryModal";
import "./Exercises.css";

function Exercises() {
  const { categories, fetchCategories, createCategory, updateCategory, deleteCategory } = useCategories();
  const { exercises, fetchExercises, createExercise, updateExercise, deleteExercise } = useExercises();

  const [searchTerm, setSearchTerm] = useState("");

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedExercise, setSelectedExercise] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const [isCreateCategoryModalOpen, setIsCreateCategoryModalOpen] = useState(false);
  const [openCategoryMenu, setOpenCategoryMenu] = useState(null);
  const [isEditCategoryModalOpen, setIsEditCategoryModalOpen] = useState(false);
  const [isDeleteCategoryModalOpen, setIsDeleteCategoryModalOpen] = useState(false);
  const [selectedCategoryForEdit, setSelectedCategoryForEdit] = useState(null);
  const [selectedCategoryForDelete, setSelectedCategoryForDelete] = useState(null);
  const categoryMenuRef = useRef(null);

  /* eslint-disable react-hooks/exhaustive-deps */

  useEffect(() => {
    fetchExercises();
    fetchCategories();
  }, []);

  /* eslint-enable react-hooks/exhaustive-deps */

  useEffect(() => {
  const handleClickOutside = (event) => {
    if (
      categoryMenuRef.current &&
      !categoryMenuRef.current.contains(event.target)
    ) {
      setOpenCategoryMenu(null);
    }
  };

  document.addEventListener(
    "mousedown",
    handleClickOutside
  );

  return () => {
    document.removeEventListener(
      "mousedown",
      handleClickOutside
    );
  };
}, []);

  const filteredExercises = exercises?.filter((exercise) =>
    exercise.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  ) || [];

  const groupedExercises = filteredExercises.reduce(
    (groups, exercise) => {

      const category = exercise.categoryId?.name;

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

  const handleSaveExercise = async (exerciseData) => {
    await updateExercise(
      selectedExercise._id,
      exerciseData
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

  const handleCreateExercise = async (exerciseData) => {
    await createExercise({
      ...exerciseData,
      categoryId: selectedCategory._id
    });

    handleCloseModal();
  };

  const handleCreateCategory = async (categoryData) => {
    await createCategory(categoryData);

    setIsCreateCategoryModalOpen(false);
  };

  const handleEditCategory = (category) => {
    setOpenCategoryMenu(null);

    setSelectedCategoryForEdit(category);
    setIsEditCategoryModalOpen(true);
  };

  const handleDeleteCategory = (category) => {
    setOpenCategoryMenu(null);

    setSelectedCategoryForDelete(category);
    setIsDeleteCategoryModalOpen(true);
  };

  const handleSaveCategory = async (updatedCategory) => {
    await updateCategory(
      selectedCategoryForEdit._id,
      updatedCategory
    );

    setIsEditCategoryModalOpen(false);
    setSelectedCategoryForEdit(null);
  };

  const handleConfirmDeleteCategory = async () => {

    if (!selectedCategoryForDelete) {
      return;
    }

    await deleteCategory(selectedCategoryForDelete._id);

    setIsDeleteCategoryModalOpen(false);
    setSelectedCategoryForDelete(null);
  };

  return (
    <div>
      <div className="page-header">
        <h2>Exercises</h2>

        <button
          className="add-category-btn"
          onClick={() =>
            setIsCreateCategoryModalOpen(true)
          }
        >
          + Category
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

        <div ref={categoryMenuRef}>
      {categories?.map((category) => {
        const categoryExercises = groupedExercises[category.name] || [];

        return (
          <div key={category._id}>

            <div className="category-section">
              <CategoryHeader
                category={category}
                openCategoryMenu={openCategoryMenu}
                setOpenCategoryMenu={setOpenCategoryMenu}
                onAddExercise={(category) => {
                  setSelectedCategory(category);
                  setIsCreateModalOpen(true);
                }}
                onEditCategory={handleEditCategory}
                onDeleteCategory={handleDeleteCategory}
              />
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
      </div>

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

      <CreateCategoryModal
        isOpen={isCreateCategoryModalOpen}
        onClose={() =>
          setIsCreateCategoryModalOpen(false)
        }
        onCreate={handleCreateCategory}
      />

      <EditCategoryModal
        isOpen={isEditCategoryModalOpen}
        category={selectedCategoryForEdit}
        onClose={() => {
          setIsEditCategoryModalOpen(false)
          setSelectedCategoryForEdit(null);
        }}
        onSave={handleSaveCategory}
      />

      <DeleteCategoryModal
        isOpen={isDeleteCategoryModalOpen}
        category={selectedCategoryForDelete}
        onClose={() => {
          setIsDeleteCategoryModalOpen(false)
          setSelectedCategoryForDelete(null)
        }}
        onDelete={handleConfirmDeleteCategory}
      />

    </div>
  );
}

export default Exercises;