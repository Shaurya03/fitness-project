import "./PersonalRecordCard.css";

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

      <div className="pr-content">

        <h3 className="pr-title">{title}</h3>

        <p className="pr-value">{value}</p>

        <div className="pr-details">

          <small className="pr-exercise">
            {exercise || "\u00A0"}
          </small>

          {workout && (
            <span className="pr-workout">{workout}</span>
          )}

          {date && (
            <span className="pr-date">{date}</span>
          )}

        </div>

      </div>

      <button
        className="view-workout-btn"
        onClick={onViewWorkout}
      >
        View
      </button>

    </div>
  );
}

export default PersonalRecordCard;