import './WorkoutPreviewModal.css';

function WorkoutPreviewModal({ children, onClose }) {

  return (
    <div
      className="modal-overlay"
      onClick={onClose}
    >
      <div
        className="modal-content"
        onClick={(event) => event.stopPropagation()}
      >
        <button
          className="modal-close"
          onClick={onClose}>
          ✕
        </button>

        {children}
      </div>
    </div>
  );
}

export default WorkoutPreviewModal;