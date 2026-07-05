import { getMetricConfig } from "../utils/metricConfig";
import { DISTANCE_SYSTEMS } from "../utils/units";
import { DEFAULT_SETTINGS, DEFAULT_UNITS } from "../utils/settings";

function WorkoutExerciseCard({
  exercise,
  exerciseIndex,

  categories,
  totalExercises,

  getSelectedExercise,
  getFilteredExercises,

  handleExerciseChange,
  handleSetChange,
  handleDurationChange,
  adjustMetricValue,
  handleUnitChange,

  addSet,
  removeSet,
  removeExercise,
}) {

  const selectedExercise =
    getSelectedExercise(exercise.exerciseId);

  const exerciseMetrics =
    selectedExercise?.metrics || [];

  const DEFAULT_DISTANCE_UNIT =
    DEFAULT_UNITS[
      DEFAULT_SETTINGS.distanceSystem
    ].distance;

  const DEFAULT_WEIGHT_UNIT =
    DEFAULT_UNITS[
      DEFAULT_SETTINGS.weightSystem
    ].weight;

  return (

    <div
      className="exercise-block"
    >

      <h4>Exercise {exerciseIndex + 1}</h4>

      <select
        name="categoryId"
        onChange={(event) =>
          handleExerciseChange(event, exerciseIndex)
        }
        value={exercise.categoryId}
      >
        <option value="">
          Select a category
        </option>

        {categories?.map((category) => (
          <option
            key={category._id}
            value={category._id}
          >
            {category.name}
          </option>
        ))}
      </select>

      <label>Exercise Name:</label>
      <select
        name="exerciseId"
        onChange={(event) =>
          handleExerciseChange(event, exerciseIndex)
        }
        value={exercise.exerciseId}
        disabled={!exercise.categoryId}
      >
        <option value="">
          Select an exercise
        </option>

        {getFilteredExercises(exercise)?.map((catalogExercise) => (
          <option
            key={catalogExercise._id}
            value={catalogExercise._id}
          >
            {catalogExercise.name}
          </option>
        ))}
        <option value="__CREATE_NEW__">
          + Create New Exercise
        </option>
      </select>

      {exercise.exerciseId && (
        <div className="sets-container">

          {exercise.sets.map((set, setIndex) => (

            <div
              key={setIndex}
              className="set-block"
            >

              <h5>
                Set {setIndex + 1}
              </h5>

              {exerciseMetrics.map((metric) => {

                const config = getMetricConfig(metric);

                if (metric === "duration") {
                  return (
                    <div
                      key={metric}
                      className="duration-inputs"
                    >

                      <label className="metric-label">
                        {config.label}
                      </label>

                      <div className="duration-time">

                        <input
                          type="number"
                          name="hours"
                          placeholder="HH"
                          onChange={(event) =>
                            handleDurationChange(
                              event,
                              exerciseIndex,
                              setIndex
                            )
                          }
                          value={set.metrics?.duration?.hours ?? ""}
                          onWheel={(event) =>
                            event.currentTarget.blur()
                          }
                        />

                        <span>:</span>

                        <input
                          type="number"
                          name="minutes"
                          placeholder="MM"
                          onChange={(event) =>
                            handleDurationChange(
                              event,
                              exerciseIndex,
                              setIndex
                            )
                          }
                          value={set.metrics?.duration?.minutes ?? ""}
                          min={0}
                          max={59}
                          onWheel={(event) =>
                            event.currentTarget.blur()
                          }
                        />

                        <span>:</span>

                        <input
                          type="number"
                          name="seconds"
                          placeholder="SS"
                          onChange={(event) =>
                            handleDurationChange(
                              event,
                              exerciseIndex,
                              setIndex
                            )
                          }
                          value={set.metrics?.duration?.seconds ?? ""}
                          min={0}
                          max={59}
                          onWheel={(event) =>
                            event.currentTarget.blur()
                          }
                        />

                      </div>

                    </div>
                  );
                }

                return (

                  <div
                    key={metric}
                    className="metric-input"
                  >
                    <label className="metric-label">
                      {config.label}

                      {metric === "weight" && ` (${DEFAULT_WEIGHT_UNIT})`}

                      {metric !== "weight" &&
                        metric !== "distance" &&
                        config.showUnit &&
                        config.unit &&
                        ` (${config.unit})`}
                    </label>

                    <div className="metric-controls">

                      <button
                        type="button"
                        onClick={() =>
                          adjustMetricValue(
                            exerciseIndex,
                            setIndex,
                            metric,
                            -1
                          )
                        }
                      >
                        -
                      </button>

                      <input
                        type="number"
                        name={metric}
                        value={
                          set.metrics?.[metric] ?? ""
                        }
                        onChange={(event) =>
                          handleSetChange(
                            event,
                            exerciseIndex,
                            setIndex
                          )
                        }
                        onWheel={(event) =>
                          event.currentTarget.blur()
                        }
                      />

                      <button
                        type="button"
                        onClick={() =>
                          adjustMetricValue(
                            exerciseIndex,
                            setIndex,
                            metric,
                            1
                          )
                        }
                      >
                        +
                      </button>



                      {metric === "distance" && (
                        <select
                          value={set.inputUnits?.distance ?? DEFAULT_DISTANCE_UNIT}
                          onChange={(event) =>
                            handleUnitChange(
                              exerciseIndex,
                              metric,
                              event.target.value
                            )
                          }
                        >
                          {DISTANCE_SYSTEMS[DEFAULT_SETTINGS.distanceSystem]
                            .map(unit => (
                              <option
                                key={unit}
                                value={unit}
                              >
                                {unit}
                              </option>
                            ))}
                        </select>
                      )}

                    </div>
                  </div>
                )
              })}

              {exercise.sets.length > 1 && (
                <button
                  type="button"
                  onClick={() =>
                    removeSet(
                      exerciseIndex,
                      setIndex
                    )
                  }
                >
                  Remove Set
                </button>
              )}

            </div>

          ))}

          <button
            type="button"
            onClick={() =>
              addSet(exerciseIndex)
            }
          >
            Add Set
          </button>

        </div>
      )}

      {totalExercises > 1 && (

        <button
          type="button"
          onClick={() =>
            removeExercise(exerciseIndex)
          }
        >
          Remove Exercise
        </button>
      )}

    </div>

  );
}

export default WorkoutExerciseCard;