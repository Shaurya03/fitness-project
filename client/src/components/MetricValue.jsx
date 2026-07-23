import { formatMetric } from "../utils/metricFormatter";
import "./MetricValue.css";

function MetricValue({
  metric,
  value,
  settings,
  inputUnits,
  className = ""
}) {

  const formatted = formatMetric(
    metric,
    value,
    settings,
    inputUnits
  );

  if (!formatted) {
    return null;
  }

  let number = formatted;
  let unit = "";

  switch (metric) {

    case "pace": {

      const slash = formatted.indexOf("/");

      number = formatted.slice(0, slash);
      unit = formatted.slice(slash);

      break;
    }

    case "duration":
      break;

    default: {

      const lastSpace = formatted.lastIndexOf(" ");

      if (lastSpace !== -1) {
        number = formatted.slice(0, lastSpace);
        unit = formatted.slice(lastSpace + 1);
      }

      break;
    }

  }

  return (
    <span className={`metric-value ${className}`}>

      <span className="metric-value-number">
        {number}
      </span>

      {unit && (
        <span className="metric-value-unit">
          {unit}
        </span>
      )}

    </span>
  );
}

export default MetricValue;