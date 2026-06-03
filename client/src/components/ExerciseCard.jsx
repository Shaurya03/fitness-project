import { useState } from "react";
import "./ExerciseCard.css";

function ExerciseCard({ exercise, onEdit, onDelete }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className="exercise-card">
      <span>{exercise.name}</span>

      <button
        className="menu-btn"
        onClick={() => setIsMenuOpen(!isMenuOpen)}
      >
        ⋮
      </button>

      {
        isMenuOpen && (
          <div className="exercise-menu">
            <button onClick={onEdit}>
              Edit
            </button>

            <button onClick={onDelete}>
              Delete
            </button>
          </div>
        )
      }
    </div>
  );
}

export default ExerciseCard;