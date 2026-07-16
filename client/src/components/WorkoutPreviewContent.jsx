import { getDisplayMetrics } from "../utils/derivedMetrics";
import { formatMetric } from "../utils/metricFormatter";
import { useSettings } from "../hooks/useSettings";
import { getMetricConfig } from "../utils/metricConfig";

import "./WorkoutPreviewContent.css";

function WorkoutPreviewContent({ workout }) {

  const { settings } = useSettings();

  return (

    <div className="workout-preview-content">

      {workout.exercises.map((exercise, index) => {

        const category =
          exercise.exerciseId?.categoryId?.name;

        return (

          <div
            className="preview-exercise"
            key={`${exercise.exerciseId?._id}-${index}`}
          >

            <div className="preview-header">

              <h4>
                {exercise.exerciseId?.name}
              </h4>

              <span className="preview-category">
                {category}
              </span>

            </div>

            <div className="preview-metrics-header">

              {getDisplayMetrics(
                exercise.sets?.[0]?.metrics || {},
                settings.distanceSystem
              ).map(metric => (

                <span
                  key={metric.key}
                  className="preview-metric-header"
                >
                  {getMetricConfig(metric.key).label}
                </span>

              ))}

            </div>

            <div className="preview-sets">

              {exercise.sets.map((set, setIndex) => {

                const displayMetrics =
                  getDisplayMetrics(
                    set.metrics,
                    settings.distanceSystem
                  );

                return (

                  <div
                    className="preview-set"
                    key={set._id || setIndex}
                  >

                    {displayMetrics.map(metric => (

                      <span
                        key={metric.key}
                        className="preview-metric"
                      >

                        {formatMetric(
                          metric.key,
                          metric.value,
                          settings,
                          set.inputUnits,
                          false
                        )}

                        {set.personalRecords?.[metric.key] && (
                          <span className="pr-trophies">
                            🏆
                          </span>
                        )}

                      </span>

                    ))}

                  </div>

                );

              })}

            </div>

          </div>

        );

      })}

    </div>

  );

}

export default WorkoutPreviewContent;