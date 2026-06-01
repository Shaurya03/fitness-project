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
      throw error;
    }
  };

  const createExercise = async (exerciseData) => {
    if (!user) return;

      const response = await fetch("/api/exercises", {
        method: "POST",
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${user.token}`
        },
        body: JSON.stringify(exerciseData)
      });

      const json = await response.json();

      if (!response.ok) {
        throw new Error(json.error);
      }

      if (response.ok) {
        dispatch({
          type: "CREATE_EXERCISE",
          payload: json
        });

        return json;
      }
  };

  return {
    exercises,
    fetchExercises,
    createExercise
  };
};
