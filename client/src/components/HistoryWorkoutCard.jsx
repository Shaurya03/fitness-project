import { format } from "date-fns";
import { getMetricConfig } from "../utils/metricConfig";
import { formatMetric } from "../utils/metricFormatter";
import { useSettings } from "../hooks/useSettings";
import { getDisplayMetrics } from "../utils/derivedMetrics";
import "./HistoryWorkoutCard.css";

function HistoryWorkoutCard({ workout }) {

  const { settings } = useSettings();

  const metricKeys = getDisplayMetrics(
    workout.sets[0].metrics,
    settings.distanceSystem
  ).map(metric => metric.key);

  const setsWithDisplayMetrics = workout.sets.map(set => ({
    ...set,
    displayMetrics: getDisplayMetrics(
      set.metrics,
      settings.distanceSystem
    )
  }));

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
            {metricKeys.map(metric => (
              <th key={metric}>
                {getMetricConfig(metric).label.toUpperCase()}
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {setsWithDisplayMetrics.map((set, index) => (
            <tr key={index}>
              {metricKeys.map(metric => {
                const value = set.displayMetrics.find(
                  item => item.key === metric
                )?.value;

                return (
                  <td key={metric}>
                    <div className="history-value">
                      {formatMetric(
                        metric,
                        value,
                        settings,
                        set.inputUnits
                      )}

                      {set.personalRecords?.[metric] && (
                        <span className="pr-trophy">
                          🏆
                        </span>
                      )}
                    </div>
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>

    </div>
  );

}

export default HistoryWorkoutCard;