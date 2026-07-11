import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { WorkoutContextProvider } from './context/WorkoutContextProvider';
import { AuthContextProvider } from './context/AuthContextProvider.jsx';
import { CategoryContextProvider } from './context/CategoryContextProvider.jsx';
import { ExerciseContextProvider } from './context/ExerciseContextProvider.jsx';
import { SettingsContextProvider } from './context/SettingsContextProvider.jsx';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import App from './App.jsx';
import "./styles/theme.css";
import "./index.css";


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <AuthContextProvider>
        <SettingsContextProvider>
          <WorkoutContextProvider>
            <CategoryContextProvider>
              <ExerciseContextProvider>
                <App />
              </ExerciseContextProvider>
            </CategoryContextProvider>
          </WorkoutContextProvider>
          <ToastContainer />
        </SettingsContextProvider>
      </AuthContextProvider>
    </BrowserRouter>
  </StrictMode>
);
