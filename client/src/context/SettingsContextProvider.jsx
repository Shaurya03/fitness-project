import { useReducer } from "react";
import { settingsContext } from "./settingsContext";
import { settingsReducer } from "./settingsReducer";

export function SettingsContextProvider({
  children
}) {

  const [state, dispatch] = useReducer(
    settingsReducer,
    {
      settings: null
    }
  );

  return (
    <settingsContext.Provider
      value={{
        ...state,
        dispatch
      }}
    >
      {children}
    </settingsContext.Provider>
  );
}