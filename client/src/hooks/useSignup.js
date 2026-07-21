import { useState } from "react";
import { useAuthContext } from "./useAuthContext";
import { API_BASE_URL } from "../services/api";
import { toast } from "react-toastify";

export const useSignup = () => {
  const { dispatch } = useAuthContext();

  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const signup = async (email, password) => {
    setIsLoading(true);
    setError(null);

    try {
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

        return false;
      }

      localStorage.setItem("user", JSON.stringify(json));
      dispatch({ type: "LOGIN", payload: json });

      return true;

    } catch {
      setError("An error occurred. Please try again.");
      toast.error("Couldn't connect to the server.");

      return false;

    } finally {
      setIsLoading(false);
    }
  };

  return { signup, isLoading, error };
};