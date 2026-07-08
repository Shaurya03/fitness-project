import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import MetricSelector from "./MetricSelector";
import "./Modal.css";

function CreateExerciseModal({
  isOpen,
  selectedCategory,
  onClose,
  onCreate,
  onRestoreRequired
}) {
  const [name, setName] = useState("");
  const [metrics, setMetrics] = useState([]);
  const [error, setError] = useState("");

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
    setError("");

    setMetrics(current =>
      current.includes(metric)
        ? current.filter(item => item !== metric)
        : [...current, metric]
    );
  };

  const handleSubmit = async () => {

    if (!name.trim()) {
      return;
    }

    if (metrics.length === 0) {
      return;
    }

    const exerciseData = {
      name: name.trim(),
      metrics
    };

    try {
      setError("");

      await onCreate(exerciseData);

      handleClose();

    } catch (error) {

      if (error.archivedExercise) {

        onRestoreRequired(exerciseData);

        return;
      }

      setError(error.error || error.message);
    }
  };

  const handleClose = () => {
    setName("");
    setError("");

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
          onChange={(event) => {
            setName(event.target.value);
            setError("");
          }}
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

        {error && (
          <p className="modal-error">
            {error}
          </p>
        )}

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
}

export default CreateExerciseModal;