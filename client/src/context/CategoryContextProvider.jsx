import { useReducer } from "react";
import { categoryContext } from "./categoryContext";
import { categoryReducer } from "./categoryReducer";

export const CategoryContextProvider = ({ children }) => {

  const [state, dispatch] = useReducer(
    categoryReducer,
    {
      categories: null
    }
  );

  return (
    <categoryContext.Provider
      value={{
        ...state,
        dispatch
      }}
    >
      {children}
    </categoryContext.Provider>
  );
};