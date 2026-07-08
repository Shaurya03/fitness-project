import { useState } from "react";
import { createPortal } from "react-dom";
import MetricSelector from "./MetricSelector";
import "./Modal.css";

function CreateCategoryModal({
  isOpen,
  onClose,
  onCreate
}) {
  const [categoryName, setCategoryName] = useState("");
  const [metrics, setMetrics] = useState([]);
  const [error, setError] = useState("");

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

    if (!categoryName.trim()) {
      return;
    }

    if (metrics.length === 0) {
      return;
    }

    try {
      setError("");

      await onCreate({
        name: categoryName.trim(),
        defaultMetrics: metrics
      });
      setCategoryName("");
      setMetrics([]);

    } catch (error) {
      setError(error.message);
    }
  };

  const handleClose = () => {
    setError("");
    setCategoryName("");
    setMetrics([]);
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
        <h2>Create Category</h2>

        <input
          value={categoryName}
          onChange={(event) => {
            setCategoryName(event.target.value);
            setError("");
          }}
          placeholder="Category name"
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
          <button onClick={handleSubmit}>
            Create
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

export default CreateCategoryModal;