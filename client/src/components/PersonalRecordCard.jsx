import './PersonalRecordCard.css';

function PersonalRecordCard({
  title,
  value,
  exercise,
  workout,
  date
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

    </div>
  );
}

export default PersonalRecordCard;