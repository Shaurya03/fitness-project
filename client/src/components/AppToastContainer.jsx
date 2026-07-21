import { ToastContainer } from "react-toastify";
import { useSettings } from "../hooks/useSettings";

function AppToastContainer() {

  const { settings } = useSettings();

  return (
    <ToastContainer
      position="top-right"
      autoClose={2000}
      newestOnTop
      closeOnClick
      pauseOnHover={false}
      draggable={false}
      hideProgressBar={false}
      theme={settings?.theme ?? "dark"}
    />
  );
}

export default AppToastContainer;