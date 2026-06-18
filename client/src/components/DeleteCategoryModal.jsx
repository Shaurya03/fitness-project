import "./Modal.css";

function DeleteCategoryModal({
  isOpen,
  category,
  onClose,
  onDelete
}) {

  if (!isOpen) {
    return null;
  }

  const handleDelete = () => {
    onDelete();
  }

  const handleClose = () => {
    onClose();
  };

  return (
    <div
      className="modal-overlay"
      onClick={handleClose}
    >
      <div
        className="modal"
        onClick={(event) => event.stopPropagation()}
      >
        <h2>Delete Category</h2>

        <p>
          Are you sure you want to delete
          <strong> {category?.name}</strong>?
        </p>

        <div className="modal-actions">
          <button onClick={handleDelete}>
            Delete
          </button>

          <button onClick={handleClose}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteCategoryModal;