import { useState, useEffect } from 'react';
import { useWorkoutContext } from "../hooks/useWorkoutContext";
import { useAuthContext } from "../hooks/useAuthContext";
import { API_BASE_URL } from "../services/api";
import { toast } from "react-toastify";
import "./WorkoutForm.css";

function WorkoutForm({ editingWorkout, setEditingWorkout }) {
  const { dispatch } = useWorkoutContext();
  const { user } = useAuthContext();

  const [category, setCategory] = useState('');
  const [title, setTitle] = useState('');
  const [load, setLoad] = useState('');
  const [reps, setReps] = useState('');
  const [error, setError] = useState(null);
  const [emptyFields, setEmptyFields] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  /* eslint-disable react-hooks/set-state-in-effect */

  useEffect(() => {
    if (editingWorkout) {
      setCategory(editingWorkout.category);
      setTitle(editingWorkout.title);
      setLoad(editingWorkout.load);
      setReps(editingWorkout.reps);
    } else {
      setCategory('');
      setTitle('');
      setLoad('');
      setReps('');
    }
  }, [editingWorkout]);

  /* eslint-enable react-hooks/set-state-in-effect */

  const resetForm = () => {
    setCategory('');
    setTitle('');
    setLoad('');
    setReps('');
    setError(null);
    setEmptyFields([]);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!user) {
      setError("You must be logged in");
      return;
    }

    const workout = {
      category,
      title,
      load: load === '' ? undefined : Number(load),
      reps: reps === '' ? undefined : Number(reps)
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

      <label>Category:</label>
      <select
        name="category"
        className={emptyFields.includes("category") ? "error" : ""}
        onChange={(event) => setCategory(event.target.value)}
        value={category}
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

      <label>Exercise Title:</label>
      <input
        name="title"
        className={emptyFields.includes("title") ? "error" : ""}
        type="text"
        onChange={(event) => setTitle(event.target.value)}
        value={title}
      />

      <label>Load (in kg):</label>
      <input
        name="load"
        className={emptyFields.includes("load") ? "error" : ""}
        type="number"
        onChange={(event) => setLoad(event.target.value)}
        value={load}
      />

      <label>Reps:</label>
      <input
        name="reps"
        className={emptyFields.includes("reps") ? "error" : ""}
        type="number"
        onChange={(event) => setReps(event.target.value)}
        value={reps}
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
