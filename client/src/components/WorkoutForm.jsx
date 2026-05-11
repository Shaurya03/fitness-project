import { useState, useEffect } from 'react';
import { useWorkoutContext } from "../hooks/useWorkoutContext";
import "./WorkoutForm.css";

function WorkoutForm({ editingWorkout, setEditingWorkout }) {
  const { dispatch } = useWorkoutContext();

  const [title, setTitle] = useState('');
  const [load, setLoad] = useState('');
  const [reps, setReps] = useState('');
  const [error, setError] = useState(null);
  const [emptyFields, setEmptyFields] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  /* eslint-disable react-hooks/set-state-in-effect */

  useEffect(() => {
    if (editingWorkout) {
      setTitle(editingWorkout.title);
      setLoad(editingWorkout.load);
      setReps(editingWorkout.reps);
    } else {
      setTitle('');
      setLoad('');
      setReps('');
    }
  }, [editingWorkout]);

  /* eslint-enable react-hooks/set-state-in-effect */

  const resetForm = () => {
    setTitle('');
    setLoad('');
    setReps('');
    setError(null);
    setEmptyFields([]);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const workout = {
      title,
      load: load === '' ? undefined : Number(load),
      reps: reps === '' ? undefined : Number(reps)
    };

    setIsLoading(true);
    try {
      if (editingWorkout) {
        const response = await fetch(`http://localhost:5000/api/workouts/${editingWorkout._id}`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(workout)
        });

        const json = await response.json();

        if (!response.ok) {
          setError(json.error);
          setEmptyFields(json.emptyFields || []);
        }

        if (response.ok) {
          resetForm();
          dispatch({
            type: 'UPDATE_WORKOUT',
            payload: json
          });
          setEditingWorkout(null);
        }

      } else {

        const response = await fetch("http://localhost:5000/api/workouts", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(workout)
        });

        const json = await response.json();

        if (!response.ok) {
          setError(json.error);
          setEmptyFields(json.emptyFields || []);
        }

        if (response.ok) {
          resetForm();
          dispatch({
            type: 'CREATE_WORKOUT',
            payload: json
          });
        }
      }
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <form onSubmit={handleSubmit}>
      <h3>
        {editingWorkout ? "Edit Workout" : "Add a New Workout"}
      </h3>

      <label>Exercise Title:</label>
      <input
        className={emptyFields.includes("title") ? "error" : ""}
        type="text"
        onChange={(event) => setTitle(event.target.value)}
        value={title}
      />

      <label>Load (in kg):</label>
      <input
        className={emptyFields.includes("load") ? "error" : ""}
        type="number"
        onChange={(event) => setLoad(event.target.value)}
        value={load}
      />

      <label>Reps:</label>
      <input
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
