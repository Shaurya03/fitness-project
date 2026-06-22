import { METRICS, METRIC_LABELS } from "../utils/metrics";
import "./MetricSelector.css";

function MetricSelector({ selectedMetrics, onToggle }) {
  return (
    <div className="metrics-grid">
      {METRICS.map(metric => (
        <label
          key={metric}
          className={`metric-chip ${selectedMetrics.includes(metric)
            ? "selected"
            : ""
            }`}
        >
          <input
            type="checkbox"
            checked={selectedMetrics.includes(metric)}
            onChange={() => onToggle(metric)}
          />

          {selectedMetrics.includes(metric) && (
            <span className="metric-check">
              ✓
            </span>
          )}

          <span>
            {METRIC_LABELS[metric]}
          </span>
        </label>
      ))}
    </div>
  )
};

export default MetricSelector;