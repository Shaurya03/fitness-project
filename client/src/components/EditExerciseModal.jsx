import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import MetricSelector from "./MetricSelector";
import "./Modal.css";

function EditExerciseModal({
  isOpen,
  exercise,
  onClose,
  onSave
}) {
  const [name, setName] = useState("");
  const [metrics, setMetrics] = useState([]);

  /* eslint-disable react-hooks/set-state-in-effect */

  useEffect(() => {
    if (exercise) {
      setMetrics(exercise.metrics || []);
      setName(exercise.name);
    }
  }, [exercise]);

  /* eslint-enable react-hooks/set-state-in-effect */

  if (!isOpen) {
    return null;
  }

  const toggleMetric = (metric) => {
    setMetrics(current =>
      current.includes(metric)
        ? current.filter(item => item !== metric)
        : [...current, metric]
    );
  };

  const handleSubmit = () => {

    if (!name.trim()) {
      return;
    }

    if (metrics.length === 0) {
      return;
    }

    onSave({
      name: name.trim(),
      metrics
    });

    setName("");
  }

  const handleClose = () => {
    setName("");
    setMetrics(exercise?.metrics || []);

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

        <h3>Metrics</h3>

        <MetricSelector
          selectedMetrics={metrics}
          onToggle={toggleMetric}
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
    </div>,
    document.body
  );
};

export default EditExerciseModal;