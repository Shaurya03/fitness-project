import { useRef, useState, useEffect } from "react";
import CategoryHeader from "./CategoryHeader";
import CreateCategoryModal from "./CreateCategoryModal";
import EditCategoryModal from "./EditCategoryModal";
import DeleteCategoryModal from "./DeleteCategoryModal";

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

  const categoryMenuRef = useRef(null);

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

    return () =>
      document.removeEventListener(
        "mousedown",
        handleClickOutside
      );
  }, []);

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

      <div ref={categoryMenuRef}>

        {categories.map((category) => (

          <div
            key={category._id}
            className="category-section"
            onClick={() =>
              onSelectCategory(category)
            }
          >
            <CategoryHeader
              category={category}
              openCategoryMenu={openCategoryMenu}
              setOpenCategoryMenu={setOpenCategoryMenu}
              onEditCategory={handleEditCategory}
              onDeleteCategory={handleDeleteCategory}
            />
          </div>

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