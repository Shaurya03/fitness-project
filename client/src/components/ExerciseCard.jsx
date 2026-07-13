import { useState, useEffect, useRef } from "react";
import { FaChevronRight } from "react-icons/fa";
import "./ExerciseCard.css";

function ExerciseCard({
  exercise,
  mode = "manage",
  onClick,
  onHistory,
  onEdit,
  onDelete
}) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    if (!isMenuOpen) return;

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

    return () =>
      document.removeEventListener(
        "mousedown",
        handleClickOutside
      );

  }, [isMenuOpen]);

  return (
    <div
      className={`exercise-card ${mode}`}
      onClick={onClick}
    >
      <span>{exercise.name}</span>

      {mode === "select" && (
        <FaChevronRight className="exercise-arrow" />
      )}

      {mode === "manage" && (
        <div
          className="menu-container"
          ref={menuRef}
          onClick={(event) => event.stopPropagation()}
        >
          <button
            className="menu-btn"
            onClick={() =>
              setIsMenuOpen(!isMenuOpen)
            }
          >
            ⋮
          </button>

          {isMenuOpen && (
            <div className="exercise-menu">

              <button
                onClick={() => {
                  setIsMenuOpen(false);
                  onHistory();
                }}
              >
                History
              </button>

              <button
                onClick={() => {
                  setIsMenuOpen(false);
                  onEdit();
                }}
              >
                Edit
              </button>

              <button
                onClick={() => {
                  setIsMenuOpen(false);
                  onDelete();
                }}
              >
                Delete
              </button>

            </div>
          )}

        </div>
      )}

    </div>
  );
}

export default ExerciseCard;