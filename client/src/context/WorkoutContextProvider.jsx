import { useReducer } from "react";
import { workoutReducer } from "./workoutReducer";
import { workoutContext } from "./workoutContext";

export const WorkoutContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(workoutReducer, {
    workouts: null
  });

  return (
    <workoutContext.Provider value={{ ...state, dispatch }}>
      {children}
    </workoutContext.Provider>
  );
};