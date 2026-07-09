import { useAuthContext } from "./useAuthContext";
import { useSettingsContext } from "./useSettingsContext";

export const useLogout = () => {
  const { dispatch: authDispatch } = useAuthContext();
  const { dispatch: settingsDispatch } = useSettingsContext();

  const logout = () => {
    localStorage.removeItem('user');

    authDispatch({ type: 'LOGOUT' });

    settingsDispatch({
      type: "SET_SETTINGS",
      payload: null
    });
  };

  return { logout };
};