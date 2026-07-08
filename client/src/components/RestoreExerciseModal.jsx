import { createPortal } from "react-dom";
import "./Modal.css";

function RestoreExerciseModal({
  isOpen,
  exerciseName,
  onRestore,
  onClose
}) {

  if (!isOpen) {
    return null;
  }

  const handleRestore = () => {
    onRestore();
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
        <h2>Restore Exercise</h2>

        <p>
          An archived exercise named
          <strong> "{exerciseName}"</strong> already
          exists.
        </p>

        <p>
          Restoring this exercise will also restore its
          workout history and personal records.
        </p>

        <p>
          The exercise will be added back to your exercise library.
        </p>

        <div className="modal-actions">
          <button onClick={handleRestore}>
            Restore Exercise
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

export default RestoreExerciseModal;