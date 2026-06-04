import { useState } from "react";
import "./CreateExerciseModal.css";

function CreateExerciseModal({
  isOpen,
  selectedCategory,
  onClose,
  onCreate
}) {
  const [name, setName] = useState("");

  if (!isOpen) {
    return null;
  }

  const handleSubmit = () => {

    if (!name.trim()) {
      return;
    }

    onCreate(name.trim());
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
        <h2>Create Exercise</h2>

        <p>
          Category: {selectedCategory}
        </p>

        <input
          value={name}
          onChange={(event) => setName(event.target.value)}
          placeholder="Exercise name"
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

export default CreateExerciseModal;