import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { useAuthContext } from "../hooks/useAuthContext";
import { API_BASE_URL } from "../services/api";
import HistoryWorkoutCard from "./HistoryWorkoutCard";
import "./Modal.css";

function ExerciseHistoryModal({
  exerciseId,
  isOpen,
  onClose
}) {

  const { user } = useAuthContext();

  const [history, setHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {

    if (!isOpen || !exerciseId || !user) {
      return;
    }

    const fetchHistory = async () => {

      setIsLoading(true);
      setError(null);
      setHistory([]);

      try {

        const response = await fetch(
          `${API_BASE_URL}/workouts/exercises/${exerciseId}/history`,
          {
            headers: {
              Authorization: `Bearer ${user.token}`
            }
          }
        );

        const json = await response.json();

        if (!response.ok) {
          setError(json.error);
          return;
        }

        setHistory(json);

      } catch {
        setError("Failed to load history");
      } finally {
        setIsLoading(false);
      }
    };

    fetchHistory();
  }, [exerciseId, isOpen, user]);

  if (!isOpen) {
    return null;
  }

  return createPortal(

    <div
      className="modal-overlay"
      onClick={onClose}
    >

      <div
        className="modal history-modal"
        onClick={(event) => event.stopPropagation()}
      >

        <h2>Exercise History</h2>

        {isLoading && <p>Loading history...</p>}

        {error && <p>{error}</p>}

        {!isLoading &&
          !error &&
          history.length === 0 && (
            <p>No workout history yet.</p>
          )}

        {!isLoading &&
          !error &&
          history.map(workout => (
            <HistoryWorkoutCard
              key={workout.workoutId}
              workout={workout}
            />
          ))}

        <div className="modal-actions">
          <button
            type="button"
            onClick={onClose}
          >
            Close
          </button>
        </div>

      </div>

    </div>,
    document.body
  );
}

export default ExerciseHistoryModal;