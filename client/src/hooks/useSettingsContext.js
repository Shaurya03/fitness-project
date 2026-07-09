import { useContext } from "react";
import { settingsContext } from "../context/settingsContext";

export const useSettingsContext = () => {
  const context = useContext(settingsContext);

  if (!context) {
    throw Error(
      "useSettingsContext must be used inside SettingsContextProvider"
    );
  }

  return context;
};