import { useState } from "react";
import { useAuthContext } from "../hooks/useAuthContext";

export function useLogin() {
  const { dispatch } = useAuthContext();

  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const login = async (email, password) => {
    setIsLoading(true);
    setError(null);

    const response = await fetch("http://localhost:5000/api/users/login", {
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

  return { login, isLoading, error };
}