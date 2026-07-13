import { useEffect, useRef, useState } from "react";
import { METRIC_LABELS } from "../utils/metrics";
import { getMetricConfig } from "../utils/metricConfig";
import { DEFAULT_UNITS } from "../utils/settings";
import { formatMetric } from "../utils/metricFormatter";
import { useWorkoutContext } from "../hooks/useWorkoutContext";
import { useAuthContext } from "../hooks/useAuthContext";
import { API_BASE_URL } from "../services/api";
import { toast } from "react-toastify";
import { UNITS, DISTANCE_SYSTEMS } from "../utils/units";
import { getDisplayMetrics } from "../utils/derivedMetrics";
import { getDisplayDistanceUnit } from "../utils/getDisplayDistanceUnit";
import { getDisplaySet } from "../utils/getDisplaySet";
import { useSettings } from "../hooks/useSettings";
import { FiMinus, FiPlus } from "react-icons/fi";
import { getHistoryWithPRs } from "../utils/prHistory";
import HistoryWorkoutCard from "./HistoryWorkoutCard";
import "./ExerciseLogger.css";

function ExerciseLogger({
  exercise,
  onBack
}) {
  const { workouts, dispatch } = useWorkoutContext();

  const { user } = useAuthContext();

  const { settings } = useSettings();

  const DEFAULT_DISTANCE_UNIT =
    DEFAULT_UNITS[
      settings.distanceSystem
    ].distance;

  const DEFAULT_WEIGHT_UNIT =
    DEFAULT_UNITS[
      settings.weightSystem
    ].weight;

  const [metricValues, setMetricValues] = useState({
    metrics: {},
    inputUnits: {}
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedSetIndex, setSelectedSetIndex] = useState(null);

  const [activeTab, setActiveTab] = useState("logger");

  const firstInputRef = useRef(null);

  const weightUnit =
    metricValues.inputUnits.weight ??
    DEFAULT_WEIGHT_UNIT;

  const distanceUnit =
    metricValues.inputUnits.distance ??
    DEFAULT_DISTANCE_UNIT;

  const todaysWorkout =
    workouts.find(workout => {

      const workoutDate =
        new Date(workout.date);

      const today =
        new Date();

      return (
        workoutDate.getFullYear() ===
        today.getFullYear() &&

        workoutDate.getMonth() ===
        today.getMonth() &&

        workoutDate.getDate() ===
        today.getDate()
      );
    });

  const loggedExercise =
    todaysWorkout?.exercises.find(
      item =>
        item.exerciseId?._id === exercise._id
    );

  const exerciseHistory = workouts
    .filter(workout =>
      workout.exercises.some(item =>
        item.exerciseId?._id === exercise._id
      )
    )
    .sort(
      (a, b) =>
        new Date(b.date) -
        new Date(a.date)
    );

  const historyWithPRs = getHistoryWithPRs(

    exerciseHistory.map(workout => {

      const exerciseData = workout.exercises.find(
        item => item.exerciseId._id === exercise._id
      );

      return {
        ...workout,
        sets: exerciseData.sets
      };
    })
  );

  const todaysWorkoutWithPRs =
    historyWithPRs.find(workout => {

      const workoutDate = new Date(workout.date);
      const today = new Date();

      return (
        workoutDate.getFullYear() === today.getFullYear() &&
        workoutDate.getMonth() === today.getMonth() &&
        workoutDate.getDate() === today.getDate()
      );
    });

  const loggedSetsWithPRs =
    todaysWorkoutWithPRs?.sets ?? [];


  /* eslint-disable react-hooks/set-state-in-effect */

  useEffect(() => {

    if (!exercise) return;

    const loggedExercise =
      todaysWorkout?.exercises.find(
        item => item.exerciseId?._id === exercise._id
      );

    const lastLoggedSet =
      loggedExercise?.sets.at(-1);

    if (lastLoggedSet) {

      setMetricValues(
        getDisplaySet({
          set: lastLoggedSet,
          settings,
          DEFAULT_WEIGHT_UNIT,
          DEFAULT_DISTANCE_UNIT
        })
      );

      return;
    }

    const metrics = {};
    const inputUnits = {};

    if (exercise.metrics.includes("duration")) {
      metrics.duration = {
        hours: "",
        minutes: "",
        seconds: ""
      };
    }

    if (exercise.metrics.includes("weight")) {
      inputUnits.weight = DEFAULT_WEIGHT_UNIT;
    }

    if (exercise.metrics.includes("distance")) {
      inputUnits.distance = DEFAULT_DISTANCE_UNIT;
    }

    setMetricValues({
      metrics,
      inputUnits
    });

  }, [
    exercise,
    todaysWorkout,
    settings,
    DEFAULT_WEIGHT_UNIT,
    DEFAULT_DISTANCE_UNIT
  ]);

  /* eslint-enable react-hooks/set-state-in-effect */

  if (!exercise) {
    return (
      <div className="exercise-logger empty">
        Select an exercise
      </div>
    );
  }

  const metricOrder = [
    "distance",
    "duration",
    "pace",
    "speed",
    "weight",
    "reps",
    "calories",
    "heartRate",
    "rpe",
    "laps"
  ];

  const getSortedDisplayMetrics = metrics => {

    const displayMetrics = getDisplayMetrics(
      metrics,
      settings.distanceSystem
    );

    displayMetrics.sort(
      (a, b) =>
        metricOrder.indexOf(a.key) -
        metricOrder.indexOf(b.key)
    );

    return displayMetrics;
  };

  const handleMetricChange = (
    metric,
    value
  ) => {

    if (metric === "duration") {

      setMetricValues(prev => ({
        ...prev,
        metrics: {
          ...prev.metrics,
          duration: {
            ...prev.metrics.duration,
            ...value
          }
        }
      }));

      return;
    }

    setMetricValues(prev => ({
      ...prev,
      metrics: {
        ...prev.metrics,
        [metric]:
          value === ""
            ? ""
            : Number(value)
      }
    }));
  };

  const handleUnitChange = (
    metric,
    unit
  ) => {

    setMetricValues(prev => ({
      ...prev,
      inputUnits: {
        ...prev.inputUnits,
        [metric]: unit
      }
    }));
  };

  const adjustMetricValue = (
    metric,
    direction
  ) => {

    let step;

    if (metric === "weight") {
      step =
        UNITS.weight[weightUnit].step;
    }

    else if (metric === "distance") {
      step =
        UNITS.distance[distanceUnit].step;
    }

    else {
      step =
        getMetricConfig(metric).step ?? 1;
    }

    const current =
      Number(
        metricValues.metrics[metric] ?? 0
      );

    let value =
      Math.max(
        0,
        current + direction * step
      );

    if (metric === "weight") {
      value = Number(
        value.toFixed(
          UNITS.weight[weightUnit].precision
        )
      );
    }

    if (metric === "distance") {
      value = Number(
        value.toFixed(
          UNITS.distance[distanceUnit].precision
        )
      );
    }

    setMetricValues(prev => ({
      ...prev,
      metrics: {
        ...prev.metrics,
        [metric]: value
      }
    }));
  };

  const handleSaveSet = async () => {

    if (!user) {
      toast.error("You must be logged in");
      return;
    }

    const hasEmptyMetric = exercise.metrics.some(metric => {

      if (metric === "duration") {

        const duration =
          metricValues.metrics.duration;

        return (
          !duration ||
          (
            Number(duration.hours || 0) === 0 &&
            Number(duration.minutes || 0) === 0 &&
            Number(duration.seconds || 0) === 0
          )
        );
      }

      return (
        metricValues.metrics[metric] === "" ||
        metricValues.metrics[metric] === undefined
      );
    });

    if (hasEmptyMetric) {
      toast.error("Please fill all metrics.");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {

      const convertedMetrics = {
        ...metricValues.metrics
      };

      if (
        convertedMetrics.weight !== undefined &&
        convertedMetrics.weight !== ""
      ) {

        const unit =
          DEFAULT_WEIGHT_UNIT;

        convertedMetrics.weight =
          UNITS.weight[unit].toBase(
            convertedMetrics.weight
          );
      }

      if (
        convertedMetrics.distance !== undefined &&
        convertedMetrics.distance !== ""
      ) {

        const unit =
          metricValues.inputUnits.distance;

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
          Number(hours) * 3600 +
          Number(minutes) * 60 +
          Number(seconds);
      }

      const newSet = {
        metrics: convertedMetrics,
        inputUnits:
          metricValues.inputUnits
      };

      let workout;
      let method;
      let url;
      let dispatchType;

      if (!todaysWorkout) {

        workout = {
          title: "",
          exercises: [
            {
              categoryId: exercise.categoryId._id,
              exerciseId: exercise._id,
              sets: [newSet]
            }
          ]
        };

        method = "POST";
        url = `${API_BASE_URL}/workouts`;
        dispatchType = "CREATE_WORKOUT";

      } else {

        workout = JSON.parse(
          JSON.stringify(todaysWorkout)
        );

        const existingExercise =
          workout.exercises.find(item => {

            const existingId =
              typeof item.exerciseId === "object"
                ? item.exerciseId._id
                : item.exerciseId;

            return existingId === exercise._id;
          });

        if (existingExercise) {

          existingExercise.sets.push(newSet);

        } else {

          workout.exercises.push({
            categoryId: exercise.categoryId._id,
            exerciseId: exercise._id,
            sets: [newSet]
          });

        }

        if (method === "PATCH") {

          workout.exercises = workout.exercises.map(exercise => ({
            categoryId:
              typeof exercise.categoryId === "object"
                ? exercise.categoryId._id
                : exercise.categoryId,

            exerciseId:
              typeof exercise.exerciseId === "object"
                ? exercise.exerciseId._id
                : exercise.exerciseId,

            sets: exercise.sets
          }));
        }

        method = "PATCH";
        url = `${API_BASE_URL}/workouts/${todaysWorkout._id}`;
        dispatchType = "UPDATE_WORKOUT";
      }

      const response = await fetch(
        url,
        {
          method,
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.token}`
          },
          body: JSON.stringify(workout)
        }
      );

      const json = await response.json();

      if (!response.ok) {
        throw new Error(json.error);
      }

      dispatch({
        type: dispatchType,
        payload: json
      });

      toast.success("Set saved.");

      const displaySet = getDisplaySet({
        set: newSet,
        settings,
        DEFAULT_WEIGHT_UNIT,
        DEFAULT_DISTANCE_UNIT
      });

      setMetricValues(displaySet);

      requestAnimationFrame(() => {
        firstInputRef.current?.focus();
      });

    } catch (error) {

      setError(error.message);
      toast.error(error.message);

    } finally {

      setIsLoading(false);

    }
  };

  const clearInputs = () => {

    const metrics = {};

    if (exercise.metrics.includes("duration")) {

      metrics.duration = {
        hours: "",
        minutes: "",
        seconds: ""
      };

    }

    setMetricValues({
      metrics,
      inputUnits: {
        weight: DEFAULT_WEIGHT_UNIT,
        distance: DEFAULT_DISTANCE_UNIT
      }
    });

    setSelectedSetIndex(null);

    requestAnimationFrame(() => {
      firstInputRef.current?.focus();
    });

  };

  const handleSelectSet = (set, index) => {

    setSelectedSetIndex(index);

    const displaySet = getDisplaySet({
      set,
      settings,
      DEFAULT_WEIGHT_UNIT,
      DEFAULT_DISTANCE_UNIT
    });

    setMetricValues(displaySet);

    requestAnimationFrame(() => {
      firstInputRef.current?.focus();
    });
  };

  const handleDeleteSet = async () => {

    const updatedSets =
      loggedExercise.sets.filter(
        (_, index) =>
          index !== selectedSetIndex
      );

    let updatedExercises;

    if (updatedSets.length === 0) {

      updatedExercises =
        todaysWorkout.exercises.filter(
          exerciseItem =>
            exerciseItem.exerciseId._id !==
            exercise._id
        );

    } else {

      updatedExercises =
        todaysWorkout.exercises.map(exerciseItem => {

          if (
            exerciseItem.exerciseId._id !==
            exercise._id
          ) {
            return exerciseItem;
          }

          return {
            ...exerciseItem,
            sets: updatedSets
          };

        });

    }

    const deleteWorkout =
      updatedExercises.length === 0;

    try {

      const response = await fetch(
        `${API_BASE_URL}/workouts/${todaysWorkout._id}`,
        {
          method:
            deleteWorkout
              ? "DELETE"
              : "PATCH",

          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.token}`
          },

          ...(deleteWorkout
            ? {}
            : {
              body: JSON.stringify({
                title: todaysWorkout.title,
                date: todaysWorkout.date,
                exercises: updatedExercises
              })
            })
        }
      );

      const json =
        deleteWorkout
          ? null
          : await response.json();

      if (!response.ok) {
        toast.error(
          json?.error ??
          "Failed to delete set."
        );
        return;
      }

      dispatch({
        type:
          deleteWorkout
            ? "DELETE_WORKOUT"
            : "UPDATE_WORKOUT",

        payload:
          deleteWorkout
            ? todaysWorkout
            : json
      });

      setSelectedSetIndex(null);

    } catch {

      toast.error(
        "Failed to delete set."
      );

    }
  };

  const handleUpdateSet = async () => {

    const convertedMetrics = {
      ...metricValues.metrics
    };

    if (convertedMetrics.weight != null) {
      convertedMetrics.weight =
        UNITS.weight[
          DEFAULT_WEIGHT_UNIT
        ].toBase(convertedMetrics.weight);
    }

    if (convertedMetrics.distance != null) {
      convertedMetrics.distance =
        UNITS.distance[
          metricValues.inputUnits.distance
        ].toBase(convertedMetrics.distance);
    }

    if (convertedMetrics.duration != null) {
      const {
        hours = 0,
        minutes = 0,
        seconds = 0
      } = convertedMetrics.duration;

      convertedMetrics.duration =
        Number(hours || 0) * 3600 +
        Number(minutes || 0) * 60 +
        Number(seconds || 0);
    }

    const updatedSet = {
      metrics: convertedMetrics,
      inputUnits: {
        weight: DEFAULT_WEIGHT_UNIT,
        distance: metricValues.inputUnits.distance
      }
    };

    const updatedExercises =
      todaysWorkout.exercises.map(exerciseItem => {

        if (
          exerciseItem.exerciseId._id !==
          exercise._id
        ) {
          return exerciseItem;
        }

        return {
          ...exerciseItem,

          sets: exerciseItem.sets.map(
            (set, index) =>
              index === selectedSetIndex
                ? updatedSet
                : set
          )
        };

      });

    try {

      const response = await fetch(
        `${API_BASE_URL}/workouts/${todaysWorkout._id}`,
        {
          method: "PATCH",

          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.token}`
          },

          body: JSON.stringify({
            title: todaysWorkout.title,
            date: todaysWorkout.date,
            exercises: updatedExercises
          })
        }
      );

      const json =
        await response.json();

      if (!response.ok) {
        toast.error(json.error);
        return;
      }

      dispatch({
        type: "UPDATE_WORKOUT",
        payload: json
      });

      setSelectedSetIndex(null);

    } catch {

      toast.error(
        "Failed to update set."
      );

    }

  };

  return (
    <div className="exercise-logger">

      <div className="logger-header">

        <button
          className="back-btn"
          onClick={onBack}
        >
          ←
        </button>

        <div>

          <h2>
            {exercise.name}
          </h2>

          <p>
            {exercise.categoryId?.name}
          </p>

          <div className="logger-tabs">

            <button
              className={`logger-tab ${activeTab === "logger" ? "active" : ""
                }`}
              onClick={() => setActiveTab("logger")}
            >
              Track
            </button>

            <button
              className={`logger-tab ${activeTab === "history" ? "active" : ""
                }`}
              onClick={() => setActiveTab("history")}
            >
              History
            </button>

          </div>

        </div>

      </div>

      <div className="exercise-content">

        {activeTab === "logger" && (

          <>

            <div className="logger-inputs">

              {exercise.metrics.map(
                (metric, index) => {

                  const config =
                    getMetricConfig(metric);

                  return (

                    <div
                      key={metric}
                      className="logger-metric"
                    >

                      <label>
                        {METRIC_LABELS[metric]}

                        {metricValues.inputUnits[metric] && (
                          <span className="metric-unit">
                            {" "}
                            ({metricValues.inputUnits[metric]})
                          </span>
                        )}
                      </label>



                      {metric === "duration" ? (

                        <div className="duration-inputs">

                          <input
                            type="number"
                            inputMode="decimal"
                            placeholder="hh"
                            value={metricValues.metrics.duration?.hours ?? ""}
                            onChange={e =>
                              handleMetricChange(
                                "duration",
                                {
                                  hours:
                                    e.target.value === ""
                                      ? ""
                                      : Number(e.target.value)
                                }
                              )
                            }
                          />

                          <input
                            type="number"
                            inputMode="decimal"
                            placeholder="mm"
                            value={metricValues.metrics.duration?.minutes ?? ""}
                            onChange={e =>
                              handleMetricChange(
                                "duration",
                                {
                                  minutes:
                                    e.target.value === ""
                                      ? ""
                                      : Number(e.target.value)
                                }
                              )
                            }
                          />

                          <input
                            type="number"
                            inputMode="decimal"
                            placeholder="ss"
                            value={metricValues.metrics.duration?.seconds ?? ""}
                            onChange={e =>
                              handleMetricChange(
                                "duration",
                                {
                                  seconds:
                                    e.target.value === ""
                                      ? ""
                                      : Number(e.target.value)
                                }
                              )
                            }
                          />

                        </div>

                      ) : (

                        <div className="metric-input-row">

                          <button
                            type="button"
                            className="metric-adjust-btn"
                            onClick={() =>
                              adjustMetricValue(
                                metric,
                                -1
                              )
                            }
                          >
                            <FiMinus />
                          </button>

                          <input
                            ref={
                              index === 0
                                ? firstInputRef
                                : null
                            }
                            type="number"
                            inputMode="decimal"
                            value={
                              metricValues.metrics[metric] ?? ""
                            }
                            min={config.min}
                            max={config.max}
                            step={
                              metric === "weight"
                                ? UNITS.weight[
                                  weightUnit
                                ].step

                                : metric === "distance"
                                  ? UNITS.distance[
                                    distanceUnit
                                  ].step

                                  : config.step ?? 1
                            }
                            onWheel={e =>
                              e.currentTarget.blur()
                            }
                            onChange={event =>
                              handleMetricChange(
                                metric,
                                event.target.value
                              )
                            }
                          />

                          <button
                            type="button"
                            className="metric-adjust-btn"
                            onClick={() =>
                              adjustMetricValue(
                                metric,
                                1
                              )
                            }
                          >
                            <FiPlus />
                          </button>

                        </div>

                      )}

                      {metric === "distance" && (

                        <select
                          value={distanceUnit}
                          onChange={event =>
                            handleUnitChange(
                              "distance",
                              event.target.value
                            )
                          }
                        >

                          {DISTANCE_SYSTEMS[
                            settings.distanceSystem
                          ].map(unit => (

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

                  );
                }
              )}

            </div>

            {error && (
              <p className="logger-error">
                {error}
              </p>
            )}

            {selectedSetIndex === null ? (

              <div className="logger-actions">

                <button
                  className="save-set-btn"
                  onClick={handleSaveSet}
                  disabled={isLoading}
                >
                  {isLoading ? "Saving..." : "Save"}
                </button>

                <button
                  className="clear-set-btn"
                  onClick={clearInputs}
                  type="button"
                >
                  Clear
                </button>

              </div>

            ) : (
              <div className="edit-set-actions">

                <button
                  className="update-set-btn"
                  onClick={handleUpdateSet}
                >
                  Update
                </button>

                <button
                  className="delete-set-btn"
                  onClick={handleDeleteSet}
                >
                  Delete
                </button>

              </div>
            )}

            <div className="logged-sets">

              <h3>
                Today's Sets
              </h3>

              {loggedSetsWithPRs.length === 0 && (
                <p>
                  No sets logged yet.
                </p>
              )}

              {loggedSetsWithPRs.length > 0 && (() => {

                const metrics = getSortedDisplayMetrics(
                  loggedSetsWithPRs[0].metrics
                );

                return (

                  <div
                    className="logged-set-header"
                    style={{
                      gridTemplateColumns: `repeat(${metrics.length}, minmax(140px, 1fr))`
                    }}
                  >

                    {metrics.map(({ key }) => {

                      const config = getMetricConfig(key);

                      const unit =
                        key === "distance"
                          ? getDisplayDistanceUnit(
                            loggedSetsWithPRs[0].inputUnits?.distance ??
                            DEFAULT_DISTANCE_UNIT,
                            settings.distanceSystem
                          )
                          : key === "weight"
                            ? DEFAULT_WEIGHT_UNIT
                            : config.unit;

                      return (
                        <span key={key}>
                          {config.label}
                          {config.showUnit ? ` (${unit})` : ""}
                        </span>
                      );

                    })}

                  </div>

                );

              })()}

              <div className="logged-sets-body">

                {loggedSetsWithPRs.map(
                  (set, index) => {

                    const displayMetrics =
                      getSortedDisplayMetrics(
                        set.metrics
                      );

                    return (

                      <div
                        key={index}
                        className={`logged-set ${selectedSetIndex === index
                          ? "selected"
                          : ""
                          }`}
                        onClick={() => handleSelectSet(set, index)}
                      >

                        <div
                          className="set-values"
                          style={{
                            gridTemplateColumns: `repeat(${displayMetrics.length}, minmax(140px, 1fr))`
                          }}
                        >

                          {displayMetrics.map(({ key, value }) => (

                            <span key={key}>

                              {formatMetric(
                                key,
                                value,
                                settings,
                                set.inputUnits,
                                false
                              )}

                              {set.personalRecords?.[key] && (
                                <span className="pr-trophy">
                                  🏆
                                </span>
                              )}

                            </span>

                          ))}

                        </div>

                      </div>
                    );
                  }
                )}

              </div>

            </div>

          </>

        )}

        {activeTab === "history" && (

          <div className="exercise-history">

            {exerciseHistory.length === 0 ? (

              <p>
                No history yet.
              </p>

            ) : (

              historyWithPRs.map(workout => (
                <HistoryWorkoutCard
                  key={workout._id}
                  workout={workout}
                />
              ))
            )}

          </div>

        )}

      </div>
    </div>
  );
};

export default ExerciseLogger;