import { useExerciseContext } from "./useExerciseContext";
import { useAuthContext } from "./useAuthContext";

export const useExercises = () => {
  const { exercises, dispatch } = useExerciseContext();
  const { user } = useAuthContext();

  const fetchExercises = async () => {
    if (!user) return;

    try {
      const response = await fetch("/api/exercises", {
        headers: {
          Authorization: `Bearer ${user.token}`
        }
      });

      const json = await response.json();

      if (response.ok) {
        dispatch({
          type: "SET_EXERCISES",
          payload: json
        });
      }
    } catch (error) {
      console.error(error);
    }
  };

  return {
    exercises,
    fetchExercises
  };
};
