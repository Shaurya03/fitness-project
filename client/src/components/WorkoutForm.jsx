import { useState, useEffect } from 'react';
import { useWorkoutContext } from "../hooks/useWorkoutContext";
import { useAuthContext } from "../hooks/useAuthContext";
import { API_BASE_URL } from "../services/api";
import { toast } from "react-toastify";
import "./WorkoutForm.css";

const emptyExercise = {
  name: '',
  category: '',
  type: 'strength',

  sets: [
    {
      load: '',
      reps: ''
    }
  ],

  duration: '',
  distance: ''
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

  const handleExerciseChange = (event, exerciseIndex) => {
    const { name, value } = event.target;

    setExercises(

      exercises.map((exercise, index) => {

        if (index === exerciseIndex) {
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

  const addExercise = () => {

    setExercises([
      ...exercises,
      {
        ...emptyExercise
      }
    ]);
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
        editingWorkout.exercises || [
          { ...emptyExercise }
        ]
      );
    } else {
      resetForm();
    }
  }, [editingWorkout]);

  /* eslint-enable react-hooks/set-state-in-effect */

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!user) {
      setError("You must be logged in");
      return;
    }

    const formattedExercises = exercises.map((exercise) => {

      if (exercise.type === "strength") {
        return {
          ...exercise,

          sets: exercise.sets.map((set) => ({
            load: Number(set.load),
            reps: Number(set.reps)
          }))
        };
      }

      return {
        name: exercise.name,
        type: exercise.type,

        duration: Number(exercise.duration),
        distance: Number(exercise.distance)
      };
    });

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

      {exercises.map((exercise, exerciseIndex) => (

        <div
          className="exercise-block"
          key={exerciseIndex}
        >

          <h4>Exercise {exerciseIndex + 1}</h4>

          <select
            name="type"
            onChange={(event) =>
              handleExerciseChange(event, exerciseIndex)
            }
            value={exercise.type}
          >
            <option value="strength">Strength</option>
            <option value="cardio">Cardio</option>
          </select>

          <label>Exercise Name:</label>
          <input
            type="text"
            name="name"
            onChange={(event) =>
              handleExerciseChange(event, exerciseIndex)
            }
            value={exercise.name}
          />

          {exercise.type === "strength" && (
            <>
              <label>Category:</label>
              <select
                name="category"
                className={emptyFields.includes("category") ? "error" : ""}
                onChange={(event) =>
                  handleExerciseChange(event, exerciseIndex)
                }
                value={exercise.category}
              >
                <option value="" disabled>Select a category</option>
                <option value="Chest">Chest</option>
                <option value="Back">Back</option>
                <option value="Legs">Legs</option>
                <option value="Shoulders">Shoulders</option>
                <option value="Biceps">Biceps</option>
                <option value="Triceps">Triceps</option>
                <option value="Forearms">Forearms</option>
                <option value="Core">Core</option>
              </select>
            </>
          )}

          {exercise.type === "strength" && (
            <>
              {exercise.sets.map((set, setIndex) => (

                <div
                  className="set-row"
                  key={setIndex}
                >

                  <h4>
                    Set {setIndex + 1}
                  </h4>

                  <label>Load (kg):</label>
                  <input
                    name="load"
                    type="number"
                    step="0.01"
                    onChange={(event) =>
                      handleSetChange(event, exerciseIndex, setIndex)
                    }
                    value={set.load}
                  />

                  <label>Reps:</label>
                  <input
                    name="reps"
                    type="number"
                    onChange={(event) =>
                      handleSetChange(event, exerciseIndex, setIndex)
                    }
                    value={set.reps}
                  />

                  {exercise.sets.length > 1 && (
                    <button
                      type="button"
                      onClick={() =>
                        removeSet(exerciseIndex, setIndex)
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
            </>
          )}

          {exercise.type === "cardio" && (
            <>
              <label>Duration (minutes):</label>
              <input
                name="duration"
                type="number"
                step="0.01"
                onChange={(event) =>
                  handleExerciseChange(event, exerciseIndex)
                }
                value={exercise.duration}
              />

              <label>Distance (km):</label>
              <input
                name="distance"
                type="number"
                step="0.01"
                onChange={(event) =>
                  handleExerciseChange(event, exerciseIndex)
                }
                value={exercise.distance}
              />
            </>
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

      ))}

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
