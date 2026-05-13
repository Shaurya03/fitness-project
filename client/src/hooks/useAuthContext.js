import { useContext } from 'react';
import { authContext } from '../context/authContext';

export const useAuthContext = () => {
  const context = useContext(authContext);

  if (!context) {
    throw new Error("useAuthContext must be used within an AuthContextProvider");
  }

  return context;
};