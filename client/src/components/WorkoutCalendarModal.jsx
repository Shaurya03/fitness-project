import { createPortal } from 'react-dom';
import DatePicker from "react-datepicker";
import './Modal.css';

function WorkoutCalendarModal({
  isOpen,
  onClose,
  workouts,
  onSelectWorkoutDate
}) {

  if (!isOpen) {
    return null;
  }

  const workoutDates =
    workouts.map(workout =>
      new Date(workout.date)
    );

  const handleDateChange = (date) => {
    onSelectWorkoutDate(date);
    onClose();
  };

  return createPortal(
    <div
      className="modal-overlay"
      onClick={onClose}
    >
      <div
        className="modal calendar-modal"
        onClick={(event) => event.stopPropagation()}
      >

        <h2>Workout Calendar</h2>

        <DatePicker
          inline
          highlightDates={workoutDates}
          onChange={handleDateChange}
          maxDate={new Date()}
        />

      </div>
    </div>,
    document.body
  );
}

export default WorkoutCalendarModal;