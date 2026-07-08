import { createPortal } from "react-dom";
import "./Modal.css";

function DeleteCategoryModal({
  isOpen,
  category,
  error,
  onClose,
  onDelete
}) {

  if (!isOpen) {
    return null;
  }

  const handleDelete = () => {
    onDelete();
  }

  const handleClose = () => {
    onClose();
  };

  return createPortal(
    <div
      className="modal-overlay"
      onClick={handleClose}
    >
      <div
        className="modal"
        onClick={(event) => event.stopPropagation()}
      >
        <h2>Delete Category</h2>

        {!error ? (
          <>
            <p>
              Are you sure you want to delete
              <strong> {category?.name}</strong>?
            </p>

            <div className="modal-actions">
              <button onClick={handleDelete}>
                Delete
              </button>

              <button onClick={handleClose}>
                Cancel
              </button>
            </div>
          </>
        ) : (
          <>
            <div className="delete-warning">
              <strong>⚠ Cannot delete category</strong>

              <p>
                This category contains{" "}
                <strong>{error.exerciseCount}</strong>{" "}
                {error.exerciseCount === 1
                  ? "exercise"
                  : "exercises"}.
              </p>

              <p>
                Delete or move them before deleting this category.
              </p>
            </div>

            <div className="modal-actions">
              <button onClick={handleClose}>
                OK
              </button>
            </div>
          </>
        )}
      </div>
    </div>,
    document.body
  );
};

export default DeleteCategoryModal;