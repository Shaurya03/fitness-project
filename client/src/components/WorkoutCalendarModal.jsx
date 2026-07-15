import { useState } from "react";
import { createPortal } from 'react-dom';
import { isSameDay } from 'date-fns';
import DatePicker from "react-datepicker";
import WorkoutPreviewModal from "./WorkoutPreviewModal";
import './Modal.css';

function WorkoutCalendarModal({
  isOpen,
  onClose,
  workouts,
  onSelectWorkoutDate
}) {

  const [selectedWorkout, setSelectedWorkout] =
    useState(null);

  const [selectedDate, setSelectedDate] =
    useState(null);

  const [isPreviewOpen, setIsPreviewOpen] =
    useState(false);

  if (!isOpen) {
    return null;
  }

  const workoutDates =
    workouts.map(workout =>
      new Date(workout.date)
    );

  const handleDateChange = (date) => {

    const workout = workouts.find(workout =>
      isSameDay(
        new Date(workout.date),
        date
      )
    );

    setSelectedWorkout(workout ?? null);
    setSelectedDate(date);
    setIsPreviewOpen(true);

  };

  return (
    <>
      {createPortal(
        <div
          className="modal-overlay"
          onClick={onClose}
        >
          <div
            className="modal"
            onClick={(event) => event.stopPropagation()}
          >
            Workout Calendar

            <DatePicker
              inline
              highlightDates={workoutDates}
              onChange={handleDateChange}
            />

          </div>
        </div>,
        document.body
      )}

      <WorkoutPreviewModal
        isOpen={isPreviewOpen}
        workout={selectedWorkout}
        selectedDate={selectedDate}
        onClose={() => setIsPreviewOpen(false)}
        onGoToWorkout={() => {
          onSelectWorkoutDate(selectedDate);
          setIsPreviewOpen(false);
          onClose();
        }}
      />
    </>
  );
}

export default WorkoutCalendarModal;