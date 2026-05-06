function WorkoutDetails({ workout }) {
  return (
    <div className="workout-details">
      <h2>{workout.title}</h2>
      <p>Load: {workout.load} kg</p>
      <p>Reps: {workout.reps}</p>
    </div>
  );
}

export default WorkoutDetails;