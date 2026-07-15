import { createPortal } from 'react-dom';
import { format } from 'date-fns';
import WorkoutDetails from './WorkoutDetails';
import './Modal.css';

function WorkoutPreviewModal({
  isOpen,
  workout,
  selectedDate,
  onClose,
  onGoToWorkout
}) {

  if (!isOpen) {
    return null;
  }

  return createPortal(
    <div
      className="modal-overlay"
      onClick={onClose}
    >
      <div
        className="modal workout-preview-modal"
        onClick={(event) => event.stopPropagation()}
      >
        <h2>
          {format(selectedDate, "EEEE, d MMM yyyy")}
        </h2>

        {workout ? (

          <>
            <p>
              {workout.exercises.length}{" "}
              {workout.exercises.length === 1
                ? "Exercise"
                : "Exercises"}
            </p>

            <WorkoutDetails
              workout={workout}
              showHeader={false}
            />

          </>

        ) : (

          <p>
            No workout logged for this day.
          </p>

        )}

        <div className="modal-actions">

          <button
            onClick={onClose}
          >
            Close
          </button>

          <button
            onClick={onGoToWorkout}
          >
            Open Day
          </button>

        </div>
      </div>
    </div>,
    document.body
  );
}

export default WorkoutPreviewModal;