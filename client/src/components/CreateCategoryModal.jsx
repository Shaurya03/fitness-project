import { useState } from "react";
import MetricSelector from "./MetricSelector";
import "./Modal.css";

function CreateCategoryModal({
  isOpen,
  onClose,
  onCreate
}) {
  const [categoryName, setCategoryName] = useState("");
  const [metrics, setMetrics] = useState([]);

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

    if (!categoryName.trim()) {
      return;
    }

    if (metrics.length === 0) {
      return;
    }

    onCreate({
      name: categoryName.trim(),
      defaultMetrics: metrics
    });
    setCategoryName("");
    setMetrics([]);
  };

  const handleClose = () => {
    setCategoryName("");
    setMetrics([]);
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
        <h2>Create Category</h2>

        <input
          value={categoryName}
          onChange={(event) => setCategoryName(event.target.value)}
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

export default CreateCategoryModal;