import { format } from "date-fns";
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

      <div className="history-sets">
        {setsWithDisplayMetrics.map((set, index) => (

          <div className="history-set" key={index}>

            <div
              className="history-values"
              style={{
                gridTemplateColumns: `repeat(${metricKeys.length}, minmax(0,1fr))`
              }}
            >

              {metricKeys.map(metric => {

                const value = set.displayMetrics.find(
                  item => item.key === metric
                )?.value;

                return (
                  <div
                    className="history-value"
                    key={metric}
                  >

                    <span>
                      {formatMetric(
                        metric,
                        value,
                        settings,
                        set.inputUnits
                      )}
                    </span>

                    {set.personalRecords?.[metric] && (
                      <span className="pr-trophy">
                        🏆
                      </span>
                    )}

                  </div>
                );

              })}

            </div>

          </div>

        ))}
      </div>

    </div>
  );

}

export default HistoryWorkoutCard;