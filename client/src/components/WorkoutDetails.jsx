import { format } from "date-fns";
import { FiTrash2 } from "react-icons/fi";
import { getMetricConfig } from "../utils/metricConfig";
import { formatMetric } from "../utils/metricFormatter";
import { useSettings } from "../hooks/useSettings";
import { DEFAULT_UNITS } from "../utils/settings";
import { getDisplayMetrics } from "../utils/derivedMetrics";
import { getDisplayDistanceUnit } from "../utils/getDisplayDistanceUnit";
import "./WorkoutDetails.css";

function WorkoutDetails({
  workout,
  onSelectedExercise,
  onDelete
}) {

  const { settings } = useSettings();

  const DEFAULT_WEIGHT_UNIT =
    DEFAULT_UNITS[
      settings.weightSystem
    ].weight;

  const exerciseCount = workout.exercises?.length || 0;

  const formattedDate = format(
    new Date(workout.date),
    "EEEE, d MMM yyyy"
  );

  const totalSets =
    workout.exercises?.reduce(
      (total, exercise) =>
        total + (exercise.sets?.length || 0),
      0
    ) || 0;

  return (
    <div className="workout-details">

      {workout.title && (
        <h2>{workout.title}</h2>
      )}

      <p>{formattedDate}</p>

      <p>
        {exerciseCount}{" "}
        {exerciseCount === 1 ? "Exercise" : "Exercises"}
        {" • "}
        {totalSets}{" "}
        {totalSets === 1 ? "Set" : "Sets"}
      </p>

      <div className="exercise-list">
        {workout.exercises?.length > 0 ? (
          workout.exercises.map((exercise, index) => {

            const displayMetrics = getDisplayMetrics(
              exercise.sets?.[0]?.metrics || {},
              settings.distanceSystem
            );

            const metricKeys =
              displayMetrics.map(metric => metric.key);

            const setsWithDisplayMetrics =
              exercise.sets?.map(set => ({
                ...set,
                displayMetrics: getDisplayMetrics(
                  set.metrics,
                  settings.distanceSystem
                )
              })) || [];

            return (

              <div
                className="exercise-item"
                key={`${exercise.exerciseId?._id}-${index}`}
                onClick={() => onSelectedExercise(exercise)}
              >

                <h4>{exercise.exerciseId?.name}</h4>

                <p className="exercise-category">
                  {exercise.exerciseId?.categoryId?.name}
                </p>

                <div className="sets-list">

                  {Array.from(
                    { length: Math.ceil(metricKeys.length / 4) },
                    (_, index) =>
                      metricKeys.slice(index * 4, index * 4 + 4)
                  ).map((metricRow, rowIndex) => (

                    <div
                      className="metrics-grid"
                      key={rowIndex}
                    >

                      {metricRow.map(metric => {

                        const config = getMetricConfig(metric);

                        const firstSet = exercise.sets?.[0];

                        const unit =
                          metric === "distance"
                            ? getDisplayDistanceUnit(
                              firstSet?.inputUnits?.distance ??
                              DEFAULT_UNITS[
                                settings.distanceSystem
                              ].distance,
                              settings.distanceSystem
                            )
                            : metric === "weight"
                              ? DEFAULT_WEIGHT_UNIT
                              : config.unit;

                        return (

                          <div
                            className="metric-item"
                            key={metric}
                          >

                            <span className="metric-header">
                              {config.label}
                              {config.showUnit
                                ? ` (${unit})`
                                : ""}
                            </span>

                            {setsWithDisplayMetrics.map((set, setIndex) => {

                              const value =
                                set.displayMetrics.find(
                                  item => item.key === metric
                                )?.value;

                              return (

                                <span
                                  className="metric-value"
                                  key={set._id || setIndex}
                                >
                                  {formatMetric(
                                    metric,
                                    value,
                                    settings,
                                    set.inputUnits,
                                    false
                                  )}
                                </span>

                              );
                            })}

                          </div>

                        );
                      })}

                    </div>

                  ))}

                </div>
              </div>
            );
          })
        ) : (
          <p>No exercises found.</p>
        )}
      </div>

      <div className="workout-actions">
        <button
          className="delete-button"
          onClick={onDelete}
        >
          <FiTrash2 />
        </button>
      </div>

    </div>
  );
}

export default WorkoutDetails;