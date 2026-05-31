import { useContext } from "react";
import { exerciseContext } from "../context/exerciseContext";

export const useExerciseContext = () => {
  const context = useContext(exerciseContext);

  if (!context) {
    throw Error(
      "useExerciseContext must be used inside ExerciseContextProvider"
    );
  }

  return context;
};