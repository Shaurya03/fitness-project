import { useState, useEffect, useRef } from "react";
import "./ExerciseCard.css";

function ExerciseCard({ exercise, onEdit, onDelete }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    if (!isMenuOpen) {
      return;
    }

    const handleClickOutside = (event) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target)
      ) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener(
      "mousedown",
      handleClickOutside
    );

    return () => {
      document.removeEventListener(
        "mousedown",
        handleClickOutside
      );
    };

  }, [isMenuOpen]);

  return (
    <div className="exercise-card">
      <span>{exercise.name}</span>

      <div
        className="menu-container"
        ref={menuRef}
      >
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
    </div>
  );
}

export default ExerciseCard;