import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { WorkoutContextProvider } from './context/WorkoutContextProvider';
import { AuthContextProvider } from './context/AuthContextProvider.jsx';
import { CategoryContextProvider } from './context/CategoryContextProvider.jsx';
import { ExerciseContextProvider } from './context/ExerciseContextProvider.jsx';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './index.css';
import App from './App.jsx';


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <AuthContextProvider>
        <WorkoutContextProvider>
          <CategoryContextProvider>
            <ExerciseContextProvider>
              <App />
            </ExerciseContextProvider>
          </CategoryContextProvider>
          <ToastContainer />
        </WorkoutContextProvider>
      </AuthContextProvider>
    </BrowserRouter>
  </StrictMode>,
);
