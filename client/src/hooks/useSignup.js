import { useState } from "react";
import { useAuthContext } from "./useAuthContext";
import { API_BASE_URL } from "../services/api";

export const useSignup = () => {
  const { dispatch } = useAuthContext();

  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const signup = async (email, password) => {
    setIsLoading(true);
    setError(null);

    const response = await fetch(`${API_BASE_URL}/users/signup`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ email, password })
    });

    const json = await response.json();

    if (!response.ok) {
      setError(json.error);
      setIsLoading(false);

      return false;
    }

    if (response.ok) {
      localStorage.setItem("user", JSON.stringify(json));
      dispatch({ type: "LOGIN", payload: json });
      setIsLoading(false);
      
      return true;
    }
  };

  return { signup, isLoading, error };
};