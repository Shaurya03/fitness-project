import { useState, useEffect } from "react";
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

    onSave({
      name: categoryName.trim(),
      defaultMetrics: metrics
    });
    setCategoryName("");
    setMetrics([]);
  };

  const handleClose = () => {
    setCategoryName(category?.name || "");
    setMetrics(category?.defaultMetrics || []);
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
        <h2>Edit Category</h2>

        <input
          value={categoryName}
          onChange={(event) => setCategoryName(event.target.value)}
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

export default EditCategoryModal;