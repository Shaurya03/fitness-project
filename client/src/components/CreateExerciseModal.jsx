import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import MetricSelector from "./MetricSelector";
import "./Modal.css";

function CreateExerciseModal({
  isOpen,
  selectedCategory,
  onClose,
  onCreate
}) {
  const [name, setName] = useState("");
  const [metrics, setMetrics] = useState([]);

  /* eslint-disable react-hooks/set-state-in-effect */

  useEffect(() => {
    setMetrics(
      selectedCategory?.defaultMetrics || []
    );
  }, [selectedCategory]);

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

    onCreate({
      name: name.trim(),
      metrics
    });

    setName("");
  }

  const handleClose = () => {
    setName("");

    setMetrics(
      selectedCategory?.defaultMetrics || []
    );

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
        <h2>Create Exercise</h2>

        <p>
          Category: {selectedCategory?.name}
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

        <h3>Metrics</h3>

        <MetricSelector
          selectedMetrics={metrics}
          onToggle={toggleMetric}
        />

        <div className="modal-actions">
          <button
            type="button"
            onClick={handleSubmit}
          >
            Create
          </button>

          <button
            type="button"
            onClick={handleClose}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default CreateExerciseModal;