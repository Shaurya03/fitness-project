import "./ExerciseCard.css";

function ExerciseCard({ exercise, onEdit }) {

  return (
    <div className="exercise-card">
      <span>{exercise.name}</span>

      <button 
        className="menu-btn"
        onClick={onEdit}
      >
        ⋮
      </button>
    </div>
  );
}

export default ExerciseCard;