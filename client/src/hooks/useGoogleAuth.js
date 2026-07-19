import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthContext } from "./useAuthContext";
import { API_BASE_URL } from "../services/api";

export const useGoogleAuth = () => {

  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] =
    useState(false);

  const { dispatch } = useAuthContext();

  const navigate = useNavigate();

  const googleAuth = async (
    credential
  ) => {

    setIsLoading(true);
    setError(null);

    try {

      const response =
        await fetch(
          `${API_BASE_URL}/users/google`,
          {
            method: "POST",
            headers: {
              "Content-Type":
                "application/json"
            },
            body: JSON.stringify({
              credential
            })
          }
        );

      const json =
        await response.json();

      if (!response.ok) {
        throw new Error(
          json.error
        );
      }

      localStorage.setItem(
        "user",
        JSON.stringify(json)
      );

      dispatch({
        type: "LOGIN",
        payload: json
      });

      navigate("/");

      return true;

    } catch (error) {

      setError(error.message);
      return false;

    } finally {

      setIsLoading(false);

    }

  };

  return {
    googleAuth,
    error,
    isLoading
  };

};