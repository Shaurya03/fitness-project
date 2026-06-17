import { useContext } from "react";
import { categoryContext } from "../context/categoryContext";

export const useCategoryContext = () => {
  const context = useContext(categoryContext);

  if (!context) {
    throw Error(
      "useCategoryContext must be used inside CategoryContextProvider"
    );
  }

  return context;
};