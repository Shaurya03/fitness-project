import { format } from "date-fns";
import { METRIC_LABELS } from "../utils/metrics";
import { formatMetric } from "../utils/metricFormatter";
import { DEFAULT_SETTINGS } from "../utils/settings";
import "./HistoryWorkoutCard.css";

function HistoryWorkoutCard({ workout }) {

  const settings = DEFAULT_SETTINGS;

  return (
    <div className="history-workout-card">

      <h3>
        {format(
          new Date(workout.date),
          "EEEE, d MMM yyyy"
        )}
      </h3>

      <table className="history-table">

        <thead>
          <tr>
            {workout.metrics.map(metric => (
              <th key={metric}>
                {METRIC_LABELS[metric]}
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {workout.sets.map((set, index) => (
            <tr
              key={`${workout.workoutId}-${index}`}
            >
              {workout.metrics.map(metric => (
                <td key={metric}>
                  {formatMetric(
                    metric,
                    set.metrics?.[metric] ?? "",
                    settings
                  )}
                </td>
              ))}
            </tr>
          ))}
        </tbody>

      </table>

    </div>
  );

}

export default HistoryWorkoutCard;