import { useState, useEffect } from 'react';
import { useWorkoutContext } from "../hooks/useWorkoutContext";
import { useAuthContext } from "../hooks/useAuthContext";
import { API_BASE_URL } from "../services/api";
import { toast } from "react-toastify";
import "./WorkoutForm.css";

function WorkoutForm({ editingWorkout, setEditingWorkout }) {
  const { dispatch } = useWorkoutContext();
  const { user } = useAuthContext();

  const [title, setTitle] = useState('');
  const [exercises, setExercises] = useState([
    {
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
    }
  ]);
  const [error, setError] = useState(null);
  const [emptyFields, setEmptyFields] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const exercise = exercises[0];

  const handleExerciseChange = (event) => {
    const { name, value } = event.target;

    setExercises([
      {
        ...exercise,
        [name]: value
      }
    ]);
  };

  const resetForm = () => {
    setTitle('');
    setExercises([
      {
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
      }
    ]);
    setError(null);
    setEmptyFields([]);
  };

  const handleSetChange = (event, setIndex) => {
    const { name, value } = event.target;

    const updatedSets = exercises[0].sets.map((set, index) => {

      if (index === setIndex) {
        return {
          ...set,
          [name]: value
        };
      }

      return set;
    });

    const updatedExercise = {
      ...exercises[0],
      sets: updatedSets
    };

    setExercises([updatedExercise]);
  };

  const addSet = () => {

    const updatedExercise = {
      ...exercises[0],

      sets: [
        ...exercises[0].sets,
        {
          load: '',
          reps: ''
        }
      ]
    };

    setExercises([updatedExercise]);
  };

  const removeSet = (setIndex) => {

    if (exercises[0].sets.length === 1) {
      return;
    }

    const updatedSets = exercises[0].sets.filter(
      (_, index) => index !== setIndex
    );

    const updatedExercise = {
      ...exercises[0],
      sets: updatedSets
    };

    setExercises([updatedExercise]);
  };


  /* eslint-disable react-hooks/set-state-in-effect */

  useEffect(() => {
    if (editingWorkout) {
      setTitle(editingWorkout.title);

      setExercises(
        editingWorkout.exercises || [
          {
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
          }
        ]
      )
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

      <select
        name="type"
        onChange={handleExerciseChange}
        value={exercise.type}
      >
        <option value="strength">Strength</option>
        <option value="cardio">Cardio</option>
      </select>

      <label>Workout Title:</label>
      <input
        name="title"
        className={emptyFields.includes("title") ? "error" : ""}
        type="text"
        onChange={(event) => setTitle(event.target.value)}
        value={title}
      />

      <label>Exercise Name:</label>
      <input
        type="text"
        name="name"
        onChange={handleExerciseChange}
        value={exercise.name}
      />

      {exercise.type === "strength" && (
        <>
          <label>Category:</label>
          <select
            name="category"
            className={emptyFields.includes("category") ? "error" : ""}
            onChange={handleExerciseChange}
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
                  handleSetChange(event, setIndex)
                }
                value={set.load}
              />

              <label>Reps:</label>
              <input
                name="reps"
                type="number"
                onChange={(event) =>
                  handleSetChange(event, setIndex)
                }
                value={set.reps}
              />

              {exercise.sets.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeSet(setIndex)}
                >
                  Remove Set
                </button>
              )}

            </div>

          ))}

          <button
            type="button"
            onClick={addSet}
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
            onChange={handleExerciseChange}
            value={exercise.duration}
          />

          <label>Distance (km):</label>
          <input
            name="distance"
            type="number"
            step="0.01"
            onChange={handleExerciseChange}
            value={exercise.distance}
          />
        </>
      )}

      <button disabled={isLoading}>
        {isLoading ? "Saving..." : editingWorkout ? "Update Workout" : "Add Workout"}
      </button>
      {editingWorkout && (
        <button type="button"
          disabled={isLoading}
          onClick={() => {
            setEditingWorkout(null);
            setError(null);
            setEmptyFields([]);
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
