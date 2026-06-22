import { useState, useEffect } from 'react';
import { useWorkoutContext } from "../hooks/useWorkoutContext";
import { useAuthContext } from "../hooks/useAuthContext";
import { useCategories } from '../hooks/useCategories';
import { useExercises } from '../hooks/useExercises';
import { API_BASE_URL } from "../services/api";
import { toast } from "react-toastify";
import "./WorkoutForm.css";

const emptyExercise = {
  categoryId: '',
  exerciseId: '',
  metrics: {}
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

  const { exercises: exerciseCatalog, fetchExercises, createExercise } = useExercises();

  const [showCreateExercise, setShowCreateExercise] = useState(false);
  const [newExerciseName, setNewExerciseName] = useState("");

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
            name === "name" &&
            value === "__CREATE_NEW__"
          ) {
            setShowCreateExercise(true);

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

  const handleMetricChange = (event, exerciseIndex) => {
    const { name, value } = event.target;

    setExercises(
      exercises.map((exercise, index) => {

        if (index === exerciseIndex) {
          return {
            ...exercise,
            metrics: {
              ...exercise.metrics,
              [name]: value
            }
          };
        }

        return exercise;
      })
    );
  };

  const resetForm = () => {
    setTitle('');
    setExercises([
      { ...emptyExercise }
    ]);
    setError(null);
    setEmptyFields([]);
  };

  const handleSetChange = (event, exerciseIndex, setIndex) => {
    const { name, value } = event.target;

    setExercises(

      exercises.map((exercise, index) => {

        if (index === exerciseIndex) {
          return {
            ...exercise,

            sets: exercise.sets.map((set, currentSetIndex) => {

              if (currentSetIndex === setIndex) {
                return {
                  ...set,
                  [name]: value
                };
              }

              return set;
            }
            )
          };
        }

        return exercise;
      }
      )
    );
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
                load: '',
                reps: ''
              }
            ]
          };
        }

        return exercise;
      })
    );
  };

  const removeSet = (exerciseIndex, setIndex) => {

    setExercises(

      exercises.map((exercise, index) => {

        if (index === exerciseIndex) {

          if (exercise.sets.length === 1) {
            return exercise;
          }

          return {
            ...exercise,

            sets: exercise.sets.filter((_, currentSetIndex) =>
              currentSetIndex !== setIndex
            )
          };
        }

        return exercise;
      })
    );
  };

  const lastExercise = exercises[exercises.length - 1];

  const addExercise = () => {

    setExercises([
      ...exercises,
      {
        ...emptyExercise,
      }
    ]);
  };

  const handleCreateExercise = async (exercise, exerciseIndex) => {
    if (!newExerciseName.trim()) {
      return;
    }

    try {
      const createdExercise = await createExercise({
        name: newExerciseName,
        categoryId: exercise.categoryId
      });

      if (!createdExercise) {
        return;
      }

      setExercises(
        exercises.map((currentExercise, index) => {

          if (index === exerciseIndex) {
            return {
              ...currentExercise,
              exerciseId: createdExercise._id
            };
          }

          return currentExercise;
        })
      );

      setShowCreateExercise(false);
      setNewExerciseName("");

    } catch (error) {
      toast.error(error.message);
    }
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
          ...exercise,
          exerciseId: exercise.exerciseId._id
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

    const formattedExercises = exercises.map((exercise) => ({
      categoryId: exercise.categoryId,
      exerciseId: exercise.exerciseId,

      metrics: Object.fromEntries(
        Object.entries(
          exercise.metrics || {}
        ).map(([key, value]) => [key, Number(value)])
      )
    }));

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

            {showCreateExercise && (
              <div>
                <input
                  type="text"
                  placeholder="Exercise Name"
                  value={newExerciseName}
                  onChange={(event) =>
                    setNewExerciseName(event.target.value)
                  }
                />

                <button
                  type="button"
                  onClick={() =>
                    handleCreateExercise(exercise, exerciseIndex)
                  }
                >
                  Save
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setShowCreateExercise(false);
                    setNewExerciseName("")
                  }}
                >
                  Cancel
                </button>
              </div>

            )}

           <div className="metric-container">

            {exerciseMetrics.map(metric => (

              <div
                key={metric}
                className="metric-input"
              >
                <label>{metric}</label>

                <input
                  type="number"
                  name={metric}
                  value={
                    exercise.metrics?.[metric] || ""
                  }
                  onChange={(event) => 
                    handleMetricChange(event, exerciseIndex)
                  }
                />
                </div>

            ))}
            
           </div>

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

    </form>
  );
}


export default WorkoutForm;
