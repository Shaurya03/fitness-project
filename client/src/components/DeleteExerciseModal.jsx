import { createPortal } from "react-dom";
import "./Modal.css";

function DeleteExerciseModal({
  isOpen,
  exercise,
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

  const hasHistory =
    (exercise?.workoutCount || 0) > 0;

  return createPortal(
    <div
      className="modal-overlay"
      onClick={handleClose}
    >
      <div
        className="modal"
        onClick={(event) => event.stopPropagation()}
      >
        <h2>Delete Exercise</h2>

        <p>
          Are you sure you want to delete
          <strong> {exercise?.name}</strong>?
        </p>

        {hasHistory ? (
          <>
            <p>
              This exercise has been used in{" "}
              <strong>
                {exercise.workoutCount}
              </strong>{" "}
              {exercise.workoutCount === 1
                ? "workout"
                : "workouts"}.
            </p>

            <p>
              It will be removed
              from your exercise library.
            </p>

            <strong>
              Your workout history and
              personal records will be preserved.
            </strong>
          </>
        ) : (
          <p>
            This exercise has not been used
            in any workouts. It will be
            permanently deleted.
          </p>
        )}

        <div className="modal-actions">
          <button onClick={handleDelete}>
            Delete
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

export default DeleteExerciseModal;