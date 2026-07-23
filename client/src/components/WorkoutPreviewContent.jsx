import { getDisplayMetrics } from "../utils/derivedMetrics";
import MetricValue from "./MetricValue";
import { useSettings } from "../hooks/useSettings";

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

                        <MetricValue
                          metric={metric.key}
                          value={metric.value}
                          settings={settings}
                          inputUnits={set.inputUnits}
                        />

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