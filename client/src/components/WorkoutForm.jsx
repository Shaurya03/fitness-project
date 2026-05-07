import { useState } from 'react';

function WorkoutForm() {
  const [title, setTitle] = useState('');
  const [load, setLoad] = useState('');
  const [reps, setReps] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    
    const workout = { 
      title,
      load: Number(load),
      reps: Number(reps)
    };

    const response = await fetch("http://localhost:5000/api/workouts", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(workout)
    });

    const json = await response.json();

    console.log(json);
  };

  return (
    <form onSubmit={handleSubmit}>
      <h3>Add a New Workout</h3>

      <label>Exercise Title:</label>
      <input 
        type="text" 
        onChange={(event) => setTitle(event.target.value)} 
        value={title} 
      />

      <label>Load (in kg):</label>
      <input 
        type="number" 
        onChange={(event) => setLoad(event.target.value)} 
        value={load} 
      />

      <label>Reps:</label>
      <input 
        type="number" 
        onChange={(event) => setReps(event.target.value)} 
        value={reps} 
      />

      <button>Add Workout</button>
    </form>
  );
}

export default WorkoutForm;
