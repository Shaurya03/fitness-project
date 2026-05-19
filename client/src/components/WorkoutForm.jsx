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
      sets: '',
      load: '',
      reps: ''
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
        sets: '',
        load: '',
        reps: ''
      }
    ]);
    setError(null);
    setEmptyFields([]);
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
            sets: '',
            load: '',
            reps: ''
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

    const formattedExercises = exercises.map((exercise) => ({
      ...exercise,
      sets: Number(exercise.sets),
      load: Number(exercise.load),
      reps: Number(exercise.reps)
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

      <label>Exercise Name:</label>
      <input
        type="text"
        name="name"
        onChange={handleExerciseChange}
        value={exercise.name}
      />

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
        <option value="Cardio">Cardio</option>
      </select>

      <label>Sets:</label>
      <input
        type="number"
        name="sets"
        onChange={handleExerciseChange}
        value={exercise.sets}
      />

      <label>Load (in kg):</label>
      <input
        name="load"
        className={emptyFields.includes("load") ? "error" : ""}
        type="number"
        onChange={handleExerciseChange}
        value={exercise.load}
      />

      <label>Reps:</label>
      <input
        name="reps"
        className={emptyFields.includes("reps") ? "error" : ""}
        type="number"
        onChange={handleExerciseChange}
        value={exercise.reps}
      />

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
