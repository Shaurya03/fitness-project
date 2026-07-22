import { useRef } from "react";
import MenuPortal from "./MenuPortal";
import { FaChevronRight } from "react-icons/fa";
import { FiMoreVertical } from "react-icons/fi";
import "./ExerciseCard.css";

function ExerciseCard({
  exercise,
  mode = "manage",
  openExerciseMenu,
  setOpenExerciseMenu,
  onClick,
  onHistory,
  onEdit,
  onDelete
}) {

  const menuButtonRef = useRef(null);

  return (
    <div
      className={`exercise-card ${mode}`}
      onClick={onClick}
    >
      <span className="exercise-name">
        {exercise.name}
      </span>

      {mode === "select" && (
        <FaChevronRight className="exercise-arrow" />
      )}

      {mode === "manage" && (
        <div
          className="menu-container"
        >
          <button
            className="menu-btn"
            ref={menuButtonRef}
            onClick={(event) => {
              event.stopPropagation();

              setOpenExerciseMenu(
                openExerciseMenu === exercise._id
                  ? null
                  : exercise._id
              );
            }}
          >
            <FiMoreVertical />
          </button>

          <MenuPortal
            anchorRef={menuButtonRef}
            isOpen={openExerciseMenu === exercise._id}
            onClose={() => setOpenExerciseMenu(null)}
          >
            <div
              className="exercise-menu"
              onClick={(event) => event.stopPropagation()}
            >

              <button
                onClick={() => {
                  setOpenExerciseMenu(null);
                  onHistory();
                }}
              >
                History
              </button>

              <button
                onClick={() => {
                  setOpenExerciseMenu(null);
                  onEdit();
                }}
              >
                Edit
              </button>

              <button
                onClick={() => {
                  setOpenExerciseMenu(null);
                  onDelete();
                }}
              >
                Delete
              </button>

            </div>
          </MenuPortal>

        </div>
      )}

    </div >
  );
}

export default ExerciseCard;