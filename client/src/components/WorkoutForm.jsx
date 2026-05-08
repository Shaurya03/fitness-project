import { useState, useEffect } from 'react';

function WorkoutForm({ setWorkouts, editingWorkout }) {
  const [title, setTitle] = useState('');
  const [load, setLoad] = useState('');
  const [reps, setReps] = useState('');
  const [error, setError] = useState(null);
  const [emptyFields, setEmptyFields] = useState([]);

  useEffect(() => {
    if (editingWorkout) {
      setTitle(editingWorkout.title);
      setLoad(editingWorkout.load);
      setReps(editingWorkout.reps);
    }
  }, [editingWorkout]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    const workout = {
      title,
      load: load === '' ? undefined : Number(load),
      reps: reps === '' ? undefined : Number(reps)
    };

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
        setTitle('');
        setLoad('');
        setReps('');
        setError(null);
        setEmptyFields([]);
        setWorkouts(prevWorkouts => prevWorkouts.map(workout => workout._id === json._id ? json : workout));
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
        setTitle('');
        setLoad('');
        setReps('');
        setError(null);
        setEmptyFields([]);
        setWorkouts(prevWorkouts => [json, ...prevWorkouts]);
      }
    };
  }
  return (
    <form onSubmit={handleSubmit}>
      <h3>Add a New Workout</h3>

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

      <button>
        {editingWorkout ? "Update Workout" : "Add Workout"}
      </button>
      {error && <div className="error">{error}</div>}
    </form>
  );
}


export default WorkoutForm;
