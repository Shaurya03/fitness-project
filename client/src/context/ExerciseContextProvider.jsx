import { useReducer } from "react";
import { exerciseContext } from "./exerciseContext";
import { exerciseReducer } from "./exerciseReducer";

export const ExerciseContextProvider = ({ children }) => {

  const [state, dispatch] = useReducer(
    exerciseReducer,
    {
      exercises: null
    }
  );

  return (
    <exerciseContext.Provider
      value={{
        ...state,
        dispatch
      }}
    >
      {children}
    </exerciseContext.Provider>
  );
};