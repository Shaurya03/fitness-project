import { useState, useEffect } from "react";
import "./Modal.css";

function EditCategoryModal({
  isOpen,
  category,
  onClose,
  onSave
}) {
  const [categoryName, setCategoryName] = useState("");

  /* eslint-disable react-hooks/set-state-in-effect */

  useEffect(() => {
    if (category) {
      setCategoryName(category.name);
    }
  }, [category]);

  /* eslint-enable react-hooks/set-state-in-effect */

  if (!isOpen) {
    return null;
  }

  const handleSubmit = () => {

    if (!categoryName.trim()) {
      return;
    }

    onSave(categoryName.trim());
    setCategoryName("");
  };

  const handleClose = () => {
    setCategoryName("");
    onClose();
  };

  return (
    <div
      className="modal-overlay"
      onClick={handleClose}
    >
      <div
        className="modal"
        onClick={(event) => event.stopPropagation()}
      >
        <h2>Edit Category</h2>

        <input
          value={categoryName}
          onChange={(event) => setCategoryName(event.target.value)}
          placeholder="Enter Category name"
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              handleSubmit();
            }
          }}
        />

        <div className="modal-actions">
          <button onClick={handleSubmit}>
            Save
          </button>

          <button onClick={handleClose}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditCategoryModal;