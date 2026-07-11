import { createPortal } from 'react-dom';
import './Modal.css';

function WorkoutPreviewModal({ children, onClose }) {

  return createPortal(
    <div
      className="modal-overlay"
      onClick={onClose}
    >
      <div
        className="modal workout-preview-modal"
        onClick={(event) => event.stopPropagation()}
      >
        {children}
      </div>
    </div>,
    document.body
  );
}

export default WorkoutPreviewModal;