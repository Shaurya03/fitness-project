function WorkoutDetails({ workout, setWorkouts, setEditingWorkout}) {
  const handleDelete = async () => {
    const response = await fetch(`http://localhost:5000/api/workouts/${workout._id}`, {
      method: "DELETE"
    });

    const json = await response.json();

    if (response.ok) {
      setWorkouts(prevWorkouts => prevWorkouts.filter((workout) => workout._id !== json._id));
    }
  };

  return (
    <div className="workout-details">
      <h2>{workout.title}</h2>
      <p>Load: {workout.load} kg</p>
      <p>Reps: {workout.reps}</p>
      <button onClick={() => setEditingWorkout(workout)}>Edit</button>
      <button onClick={handleDelete}>Delete</button>
    </div>
  );
}

export default WorkoutDetails;