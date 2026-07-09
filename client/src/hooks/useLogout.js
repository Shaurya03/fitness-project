import { useAuthContext } from "./useAuthContext";
import { useSettingsContext } from "./useSettingsContext";
import { useWorkoutContext } from "./useWorkoutContext";
import { useCategoryContext } from "./useCategoryContext";
import { useExerciseContext } from "./useExerciseContext";

export const useLogout = () => {
  const { dispatch: authDispatch } = useAuthContext();
  const { dispatch: settingsDispatch } = useSettingsContext();
  const { dispatch: workoutDispatch } = useWorkoutContext();
  const { dispatch: categoryDispatch } = useCategoryContext();
  const { dispatch: exerciseDispatch } = useExerciseContext();

  const logout = () => {
    localStorage.removeItem('user');

    authDispatch({ type: 'LOGOUT' });

    settingsDispatch({
      type: "SET_SETTINGS",
      payload: null
    });

    workoutDispatch({
      type: "SET_WORKOUTS",
      payload: []
    });

    categoryDispatch({
      type: "SET_CATEGORIES",
      payload: []
    });

    exerciseDispatch({
      type: "SET_EXERCISES",
      payload: []
    });
  };

  return { logout };
};