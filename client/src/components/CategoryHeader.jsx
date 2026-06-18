function CategoryHeader({
  category,
  openCategoryMenu,
  setOpenCategoryMenu,
  onAddExercise,
  onEditCategory,
  onDeleteCategory
}) {

  const handleAdd = () => {
    onAddExercise(category);
  };

  const handleEdit = () => {
    onEditCategory(category);
  };

  const handleDelete = () => {
    onDeleteCategory(category);
  };

  return (
    <div className="category-header">
      <h3>{category.name}</h3>

      <div
        className="category-actions"
      >
        <button
          className="category-add-btn"
          onClick={handleAdd}
        >
          +
        </button>

        <button
          className="category-menu-btn"
          onClick={() =>
            setOpenCategoryMenu(
              openCategoryMenu === category._id
                ? null
                : category._id
            )
          }
        >
          ⋮
        </button>

        {openCategoryMenu === category._id && (
          <div className="category-menu">
            <button
              onClick={handleEdit}
            >
              Edit
            </button>

            <button
              onClick={handleDelete}
            >
              Delete
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default CategoryHeader;