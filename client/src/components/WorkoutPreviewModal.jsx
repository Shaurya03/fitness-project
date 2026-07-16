import { createPortal } from 'react-dom';
import { format } from 'date-fns';
import WorkoutPreviewContent from './WorkoutPreviewContent';
import './Modal.css';

function WorkoutPreviewModal({
  isOpen,
  workout,
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
          {format(
            new Date(workout.date),
            "EEEE, d MMM yyyy"
          )}
        </h2>

        <p>
          {workout.exercises.length}{" "}
          {workout.exercises.length === 1
            ? "Exercise"
            : "Exercises"}
        </p>

        <div className="workout-preview-body">
          <WorkoutPreviewContent
            workout={workout}
          />
        </div>

        <div className="modal-actions">

          <button
            onClick={onClose}
          >
            Close
          </button>

          <button
            onClick={onGoToWorkout}
          >
            Go To Workout
          </button>

        </div>
      </div>
    </div>,
    document.body
  );
}

export default WorkoutPreviewModal;