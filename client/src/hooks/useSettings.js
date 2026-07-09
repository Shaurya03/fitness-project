import { useSettingsContext } from "./useSettingsContext";
import { useAuthContext } from "./useAuthContext";

export const useSettings = () => {
  const { settings, dispatch } = useSettingsContext();
  const { user } = useAuthContext();

  const fetchSettings = async () => {
    if (!user) return;

    const response = await fetch("/api/settings", {
      headers: {
        Authorization: `Bearer ${user.token}`
      }
    });

    const json = await response.json();

    if (response.ok) {
      dispatch({
        type: "SET_SETTINGS",
        payload: json
      });
    }
  };

  const updateSettings = async (settingsData) => {
    if (!user) return;

    const response = await fetch("/api/settings", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${user.token}`
      },
      body: JSON.stringify(settingsData)
    });

    const json = await response.json();

    if (!response.ok) {
      throw new Error(json.error);
    }

    dispatch({
      type: "UPDATE_SETTINGS",
      payload: json
    });

    return json;
  };

  return {
    settings,
    fetchSettings,
    updateSettings
  };
};