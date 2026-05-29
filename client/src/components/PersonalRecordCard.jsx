import './PersonalRecordCard.css';

function PersonalRecordCard({
  title,
  value,
  exercise,
  workout,
  date,
  onViewWorkout
}) {

  return (
    <div className="pr-card">

      <h3>{title}</h3>
      <p>{value}</p>
      {
        exercise &&
        <small>{exercise}</small>
      }
      {
        workout &&
        <small>{workout}</small>
      }
      {
        date &&
        <small>{date}</small>
      }
      <button
        className="view-workout-btn"
        onClick={onViewWorkout}
      >
        View Workout
      </button>

    </div>
  );
}

export default PersonalRecordCard;