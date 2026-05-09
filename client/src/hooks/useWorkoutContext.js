import { useContext } from "react";
import { workoutContext } from "../context/workoutContext";

export const useWorkoutContext = () => {
  const context = useContext(workoutContext);

  if (!context) {
    throw new Error("useWorkoutContext must be used inside a WorkoutContextProvider");
  }

  return context;
};