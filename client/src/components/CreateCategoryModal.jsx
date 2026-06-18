import { useState } from "react";
import "./Modal.css";

function CreateCategoryModal({
  isOpen,
  onClose,
  onCreate
}) {
  const [categoryName, setCategoryName] = useState("");

  if (!isOpen) {
    return null;
  }

  const handleSubmit = () => {

    if (!categoryName.trim()) {
      return;
    }

    onCreate(categoryName.trim());
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
        <h2>Create Category</h2>

        <input
          value={categoryName}
          onChange={(event) => setCategoryName(event.target.value)}
          placeholder="Category name"
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              handleSubmit();
            }
          }}
        />

        <div className="modal-actions">
          <button onClick={handleSubmit}>
            Create
          </button>

          <button onClick={handleClose}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateCategoryModal;