import { useState, useEffect } from "react";
import "./EditExerciseModal.css";

function EditExerciseModal({
  isOpen,
  exercise,
  onClose,
  onSave
}) {
  const [name, setName] = useState("");

  /* eslint-disable react-hooks/set-state-in-effect */

  useEffect(() => {
    if (exercise) {
      setName(exercise.name);
    }
  }, [exercise]);

  /* eslint-enable react-hooks/set-state-in-effect */

  if (!isOpen) {
    return null;
  }

  const handleSubmit = () => {

    if (!name.trim()) {
      return;
    }

    onSave(name.trim());
    setName("");
  }

  const handleClose = () => {
    setName("");
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
        <h2>Edit Exercise</h2>

        <input
          value={name}
          onChange={(event) => setName(event.target.value)}
          placeholder="Enter Exercise name"
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

export default EditExerciseModal;