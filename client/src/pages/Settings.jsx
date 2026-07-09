import { useSettings } from "../hooks/useSettings";


function Settings() {
  const {
    settings,
    updateSettings
  } = useSettings();

  if (!settings) {
    return (
      <div className="settings-page">
        <p>Loading settings...</p>
      </div>
    );
  }

  const handleSettingChange = async (
    setting,
    value
  ) => {
    await updateSettings({
      [setting]: value
    });
  };

  return (
    <div className="settings-page">

      <h2>Settings</h2>

      <div className="settings-section">

        <h3>Appearance</h3>

        <label className="settings-option">
          <input
            type="radio"
            name="theme"
            value="light"
            checked={settings.theme === "light"}
            onChange={() =>
              handleSettingChange(
                "theme",
                "light"
              )
            }
          />
          Light
        </label>

        <label className="settings-option">
          <input
            type="radio"
            name="theme"
            value="dark"
            checked={settings.theme === "dark"}
            onChange={() =>
              handleSettingChange(
                "theme",
                "dark"
              )
            }
          />
          Dark
        </label>

      </div>

      <div className="settings-section">

        <h3>Weight</h3>

        <label className="settings-option">
          <input
            type="radio"
            name="weightSystem"
            value="metric"
            checked={
              settings.weightSystem === "metric"
            }
            onChange={() =>
              handleSettingChange(
                "weightSystem",
                "metric"
              )
            }
          />
          Metric (kg)
        </label>

        <label className="settings-option">
          <input
            type="radio"
            name="weightSystem"
            value="imperial"
            checked={
              settings.weightSystem === "imperial"
            }
            onChange={() =>
              handleSettingChange(
                "weightSystem",
                "imperial"
              )
            }
          />
          Imperial (lb)
        </label>

      </div>

      <div className="settings-section">

        <h3>Distance</h3>

        <label className="settings-option">
          <input
            type="radio"
            name="distanceSystem"
            value="metric"
            checked={
              settings.distanceSystem === "metric"
            }
            onChange={() =>
              handleSettingChange(
                "distanceSystem",
                "metric"
              )
            }
          />
          Metric (km / m)
        </label>

        <label className="settings-option">
          <input
            type="radio"
            name="distanceSystem"
            value="imperial"
            checked={
              settings.distanceSystem === "imperial"
            }
            onChange={() =>
              handleSettingChange(
                "distanceSystem",
                "imperial"
              )
            }
          />
          Imperial (mi / ft)
        </label>

      </div>

      <div className="settings-section">

        <h3>Exercise Library</h3>

        <button type="button">
          Manage Archived Exercises
        </button>

      </div>

    </div>
  );
}

export default Settings;