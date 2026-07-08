import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import MetricSelector from "./MetricSelector";
import "./Modal.css";

function EditCategoryModal({
  isOpen,
  category,
  onClose,
  onSave
}) {
  const [categoryName, setCategoryName] = useState("");
  const [metrics, setMetrics] = useState([]);
  const [error, setError] = useState("");

  /* eslint-disable react-hooks/set-state-in-effect */

  useEffect(() => {
    if (category) {
      setCategoryName(category.name);
      setMetrics(category.defaultMetrics || []);
    }
  }, [category]);

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

    if (!categoryName.trim()) {
      return;
    }

    if (metrics.length === 0) {
      return;
    }

    try {
      setError("");

      await onSave({
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
    setCategoryName(category?.name || "");
    setMetrics(category?.defaultMetrics || []);
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
        <h2>Edit Category</h2>

        <input
          value={categoryName}
          onChange={(event) => {
            setCategoryName(event.target.value)
            setError("");
          }}
          placeholder="Enter Category name"
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

export default EditCategoryModal;