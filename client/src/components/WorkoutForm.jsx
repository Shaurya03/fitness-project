import { useState, useEffect } from 'react';
import { useWorkoutContext } from "../hooks/useWorkoutContext";
import { useAuthContext } from "../hooks/useAuthContext";
import { useCategories } from '../hooks/useCategories';
import { useExercises } from '../hooks/useExercises';
import { getMetricConfig } from '../utils/metricConfig';
import { API_BASE_URL } from "../services/api";
import { toast } from "react-toastify";
import { UNITS } from '../utils/units';
import CreateExerciseModal from "./CreateExerciseModal";
import "./WorkoutForm.css";

const emptyExercise = {
  categoryId: '',
  exerciseId: '',

  sets: [
    {
      metrics: {},
      units: {}
    }
  ]
};

function WorkoutForm({ editingWorkout, setEditingWorkout }) {
  const { dispatch } = useWorkoutContext();
  const { user } = useAuthContext();

  const [title, setTitle] = useState('');
  const [exercises, setExercises] = useState([
    { ...emptyExercise }
  ]);
  const [error, setError] = useState(null);
  const [emptyFields, setEmptyFields] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const [showCreateExerciseModal, setShowCreateExerciseModal] = useState(false);
  const [targetExerciseIndex, setTargetExerciseIndex] = useState(null);

  const { exercises: exerciseCatalog, fetchExercises, createExercise } = useExercises();

  const { categories, fetchCategories } = useCategories();

  const handleExerciseChange = (event, exerciseIndex) => {
    const { name, value } = event.target;

    setExercises(

      exercises.map((exercise, index) => {

        if (index === exerciseIndex) {

          if (name === "categoryId") {
            return {
              ...exercise,
              categoryId: value,
              exerciseId: ""
            };
          }

          if (
            name === "exerciseId" &&
            value === "__CREATE_NEW__"
          ) {
            setTargetExerciseIndex(exerciseIndex);
            setShowCreateExerciseModal(true);

            return exercise;
          }

          return {
            ...exercise,
            [name]: value
          };
        }

        return exercise;
      }
      )
    );
  };

  const handleSetChange = (event, exerciseIndex, setIndex) => {
    const { name, value } = event.target;

    setExercises(
      exercises.map((exercise, index) => {

        if (index === exerciseIndex) {

          const updatedSets = exercise.sets.map(
            (set, currentSetIndex) => {

              if (currentSetIndex === setIndex) {
                return {
                  ...set,

                  metrics: {
                    ...set.metrics,
                    [name]: value === ""
                      ? ""
                      : Number(value)
                  }
                };
              }

              return set;
            }
          );

          return {
            ...exercise,
            sets: updatedSets
          };
        }

        return exercise;
      })
    );
  };

  const adjustMetricValue = (
    exerciseIndex,
    setIndex,
    metric,
    direction
  ) => {
    const config = getMetricConfig(metric);

    const currentValue =
      exercises[exerciseIndex]
        .sets[setIndex]
        .metrics[metric] ?? 0;

    const newValue =
      currentValue + direction * config.step;

    const adjustedValue =
      config.max !== undefined
        ? Math.min(
          config.max,
          Math.max(config.min, newValue)
        )
        : Math.max(config.min, newValue);

    const updatedExercises = exercises.map((exercise, currentExerciseIndex) => {
      if (currentExerciseIndex === exerciseIndex) {

        const updatedSets = exercise.sets.map(
          (set, currentSetIndex) => {

            if (currentSetIndex === setIndex) {
              return {
                ...set,

                metrics: {
                  ...set.metrics,
                  [metric]: adjustedValue
                }
              };
            }

            return set;
          }
        );

        return {
          ...exercise,
          sets: updatedSets
        };
      }

      return exercise;
    });

    setExercises(updatedExercises);
  };

  const handleUnitChange = (
    exerciseIndex,
    metric,
    unit
  ) => {
    setExercises(
      exercises.map((exercise, index) => {

        if (index === exerciseIndex) {

          const updatedSets = exercise.sets.map(set => ({
            ...set,
            units: {
              ...set.units,
              [metric]: unit
            }
          }));

          return {
            ...exercise,
            sets: updatedSets
          };
        }

        return exercise;
      })
    );
  };

  const handleDurationChange = (
    event,
    exerciseIndex,
    setIndex
  ) => {
    const { name, value } = event.target;

    setExercises(
      exercises.map((exercise, index) => {

        if (index === exerciseIndex) {

          const updatedSets = exercise.sets.map(
            (set, currentSetIndex) => {

              if (currentSetIndex === setIndex) {
                return {
                  ...set,

                  metrics: {
                    ...set.metrics,

                    duration: {
                      ...(set.metrics.duration || {}),
                      [name]: value === ""
                        ? ""
                        : Number(value)
                    }
                  }
                };
              }

              return set;
            }
          );

          return {
            ...exercise,
            sets: updatedSets
          };
        }

        return exercise;
      })
    );
  };

  const handleCreateExercise = async (exerciseData) => {
    try {
      const createdExercise = await createExercise({
        ...exerciseData,
        categoryId: selectedCategory._id
      });

      if (!createdExercise) {
        return;
      }

      setExercises(
        exercises.map((exercise, index) =>
          index === targetExerciseIndex
            ? {
              ...exercise,
              exerciseId: createdExercise._id
            }
            : exercise
        )
      );

      setShowCreateExerciseModal(false);
      setTargetExerciseIndex(null);

    } catch (error) {
      toast.error(error.message);
    }
  };

  const resetForm = () => {
    setTitle('');
    setExercises([
      { ...emptyExercise }
    ]);
    setError(null);
    setEmptyFields([]);
  };

  const addExercise = () => {

    setExercises([
      ...exercises,
      {
        ...emptyExercise,
      }
    ]);
  };

  const addSet = (exerciseIndex) => {

    setExercises(
      exercises.map((exercise, index) => {

        if (index === exerciseIndex) {
          return {
            ...exercise,

            sets: [
              ...exercise.sets,
              {
                metrics: {},
                units: {
                  ...exercise.sets[0].units
                }
              }
            ]
          };
        }

        return exercise;
      })
    );
  };

  const removeSet = (
    exerciseIndex,
    setIndex
  ) => {

    setExercises(
      exercises.map((exercise, index) => {

        if (index === exerciseIndex) {

          if (exercise.sets.length === 1) {
            return {
              ...exercise,
              sets: [
                {
                  metrics: {},
                  units: {}
                }
              ]
            };
          }

          return {
            ...exercise,

            sets: exercise.sets.filter(
              (_, currentSetIndex) =>
                currentSetIndex !== setIndex
            )
          };
        }

        return exercise;
      })
    );
  };

  const removeExercise = (exerciseIndex) => {

    if (exercises.length === 1) {
      return;
    }

    setExercises(exercises.filter((_, index) =>
      index !== exerciseIndex
    ));
  };

  /* eslint-disable react-hooks/set-state-in-effect */

  useEffect(() => {
    if (editingWorkout) {
      setTitle(editingWorkout.title);

      setExercises(
        editingWorkout.exercises.map(exercise => ({
          categoryId: exercise.categoryId,
          exerciseId: exercise.exerciseId._id,
          sets: exercise.sets || [
            {
              metrics: {},
              units: {}
            }
          ]
        }))
      );
    } else {
      resetForm();
    }
  }, [editingWorkout]);

  /* eslint-enable react-hooks/set-state-in-effect */

  /* eslint-disable react-hooks/exhaustive-deps */

  useEffect(() => {
    if (user) {
      fetchExercises();
      fetchCategories();
    }
  }, [user]);

  /* eslint-enable react-hooks/exhaustive-deps */

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!user) {
      setError("You must be logged in");
      return;
    }

    const formattedExercises = exercises.map(
      exercise => ({
        categoryId: exercise.categoryId,
        exerciseId: exercise.exerciseId,

        sets: exercise.sets.map(set => {
          const convertedMetrics = {
            ...set.metrics
          };

          if (
            convertedMetrics.distance !== undefined &&
            convertedMetrics.distance !== ""
          ) {
            const unit =
              set.units?.distance || "m";

            convertedMetrics.distance =
              UNITS.distance[unit].toBase(
                convertedMetrics.distance
              );
          }

          if (convertedMetrics.duration) {

            const {
              hours = 0,
              minutes = 0,
              seconds = 0
            } = convertedMetrics.duration;

            convertedMetrics.duration =
              hours * 3600 +
              minutes * 60 +
              seconds;
          }

          return {
            metrics: convertedMetrics
          };
        })
      })
    );

    const workout = {
      title,
      exercises: formattedExercises,
    };

    setIsLoading(true);
    try {
      if (editingWorkout) {
        const response = await fetch(`${API_BASE_URL}/workouts/${editingWorkout._id}`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            'Authorization': `Bearer ${user.token}`
          },
          body: JSON.stringify(workout)
        });

        const json = await response.json();

        if (!response.ok) {
          setError(json.error);
          setEmptyFields(json.emptyFields || []);
          toast.error(json.error);
          return;
        }

        resetForm();
        dispatch({
          type: 'UPDATE_WORKOUT',
          payload: json
        });
        toast.success("Workout updated successfully!");
        setEditingWorkout(null);

      } else {

        const response = await fetch(`${API_BASE_URL}/workouts`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            'Authorization': `Bearer ${user.token}`
          },
          body: JSON.stringify(workout)
        });

        const json = await response.json();

        if (!response.ok) {
          setError(json.error);
          setEmptyFields(json.emptyFields || []);
          toast.error(json.error);
          return;
        }

        resetForm();
        dispatch({
          type: 'CREATE_WORKOUT',
          payload: json
        });
        toast.success("Workout added successfully!");
      }
    } catch {
      setError("An error occurred. Please try again.");
      toast.error("An error occurred. Please try again.");

    } finally {
      setIsLoading(false);
    }
  };

  const getFilteredExercises = (exercise) => {
    return exerciseCatalog?.filter(
      item =>
        item.categoryId?._id === exercise.categoryId
    ) || [];
  };

  const getSelectedExercise = (exerciseId) => {
    return exerciseCatalog?.find(
      exercise => exercise._id === exerciseId
    );
  };

  const selectedCategory = categories?.find(
    category =>
      category._id === exercises[targetExerciseIndex]?.categoryId
  );

  return (
    <form className="workout-form" onSubmit={handleSubmit}>
      <h3>
        {editingWorkout ? "Edit Workout" : "Add a New Workout"}
      </h3>

      <label>Workout Title:</label>
      <input
        name="title"
        className={emptyFields.includes("title") ? "error" : ""}
        type="text"
        onChange={(event) => setTitle(event.target.value)}
        value={title}
      />

      {exercises.map((exercise, exerciseIndex) => {
        const selectedExercise =
          getSelectedExercise(exercise.exerciseId);

        const exerciseMetrics =
          selectedExercise?.metrics || [];

        return (

          <div
            className="exercise-block"
            key={exerciseIndex}
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

                            <label>{config.label}</label>

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
                          <label>
                            {config.label}
                            {config.showUnit ? ` (${config.unit})` : ""}
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
                                value={set.units?.distance || "km"}
                                onChange={(event) =>
                                  handleUnitChange(
                                    exerciseIndex,
                                    metric,
                                    event.target.value
                                  )
                                }
                              >
                                {Object.keys(UNITS.distance).map(unit => (
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

            {exercises.length > 1 && (

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
      })}

      <button
        type="button"
        onClick={addExercise}
      >
        Add Exercise
      </button>

      <button disabled={isLoading}>
        {isLoading ? "Saving..." : editingWorkout ? "Update Workout" : "Add Workout"}
      </button>
      {editingWorkout && (
        <button type="button"
          disabled={isLoading}
          onClick={() => {
            setEditingWorkout(null);
            resetForm();
          }}
        >
          Cancel
        </button>
      )}
      {error && <div className="error">{error}</div>}

      <CreateExerciseModal
        isOpen={showCreateExerciseModal}
        selectedCategory={selectedCategory}
        onClose={() => {
          setShowCreateExerciseModal(false);
          setTargetExerciseIndex(null);
        }}
        onCreate={handleCreateExercise}
      />

    </form>
  );
}


export default WorkoutForm;