function WorkoutDetails({ workout }) {
  return (
    <div>
      <h2>{workout.title}</h2>
      <p>Load: {workout.load} kg</p>
      <p>Reps: {workout.reps}</p>
    </div>
  );
}

export default WorkoutDetails;