import { useState } from "react";
import CategoryCard from "./CategoryCard";
import CreateCategoryModal from "./CreateCategoryModal";
import EditCategoryModal from "./EditCategoryModal";
import DeleteCategoryModal from "./DeleteCategoryModal";
import "./CategoryList.css";

function CategoryList({
  categories,
  createCategory,
  updateCategory,
  deleteCategory,
  onSelectCategory
}) {

  const [openCategoryMenu, setOpenCategoryMenu] = useState(null);

  const [isCreateCategoryModalOpen, setIsCreateCategoryModalOpen] = useState(false);
  const [isEditCategoryModalOpen, setIsEditCategoryModalOpen] = useState(false);
  const [isDeleteCategoryModalOpen, setIsDeleteCategoryModalOpen] = useState(false);

  const [selectedCategoryForEdit, setSelectedCategoryForEdit] = useState(null);
  const [selectedCategoryForDelete, setSelectedCategoryForDelete] = useState(null);

  const [deleteCategoryError, setDeleteCategoryError] = useState(null);


  const handleCreateCategory = async (categoryData) => {
    await createCategory(categoryData);
    setIsCreateCategoryModalOpen(false);
  };

  const handleEditCategory = (category) => {
    setOpenCategoryMenu(null);
    setSelectedCategoryForEdit(category);
    setIsEditCategoryModalOpen(true);
  };

  const handleSaveCategory = async (updatedCategory) => {
    await updateCategory(
      selectedCategoryForEdit._id,
      updatedCategory
    );

    setIsEditCategoryModalOpen(false);
    setSelectedCategoryForEdit(null);
  };

  const handleDeleteCategory = (category) => {
    setOpenCategoryMenu(null);
    setDeleteCategoryError(null);
    setSelectedCategoryForDelete(category);
    setIsDeleteCategoryModalOpen(true);
  };

  const handleConfirmDeleteCategory = async () => {

    if (!selectedCategoryForDelete) {
      return;
    }

    try {

      await deleteCategory(
        selectedCategoryForDelete._id
      );

      setDeleteCategoryError(null);
      setIsDeleteCategoryModalOpen(false);
      setSelectedCategoryForDelete(null);

    } catch (error) {
      setDeleteCategoryError(error);
    }
  };

  return (
    <>
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

      <div
        className="category-list"
      >

        {categories.map((category) => (
          <CategoryCard
            key={category._id}
            category={category}
            exerciseCount={category.exercises?.length ?? 0}
            openCategoryMenu={openCategoryMenu}
            setOpenCategoryMenu={setOpenCategoryMenu}
            onSelect={() => onSelectCategory(category)}
            onEditCategory={handleEditCategory}
            onDeleteCategory={handleDeleteCategory}
          />
        ))}

      </div>

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
          setIsEditCategoryModalOpen(false);
          setSelectedCategoryForEdit(null);
        }}
        onSave={handleSaveCategory}
      />

      <DeleteCategoryModal
        isOpen={isDeleteCategoryModalOpen}
        category={selectedCategoryForDelete}
        error={deleteCategoryError}
        onClose={() => {
          setDeleteCategoryError(null);
          setIsDeleteCategoryModalOpen(false);
          setSelectedCategoryForDelete(null);
        }}
        onDelete={handleConfirmDeleteCategory}
      />

    </>
  );
}

export default CategoryList;