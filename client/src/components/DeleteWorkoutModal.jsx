import { createPortal } from "react-dom";
import "./Modal.css";

function DeleteWorkoutModal({
  isOpen,
  onClose,
  onDelete
}) {

  if (!isOpen) {
    return null;
  }

  const handleDelete = () => {
    onDelete();
  };

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
        <h2>Delete Workout</h2>

        <p>
          Are you sure you want to permanently
          delete this workout?
        </p>

        <p className="modal-warning">
          This action cannot be undone.
        </p>

        <div className="modal-actions">
          <button onClick={handleDelete}>
            Delete Workout
          </button>

          <button onClick={handleClose}>
            Cancel
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}

export default DeleteWorkoutModal;