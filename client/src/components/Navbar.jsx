import { useEffect } from "react";
import { NavLink } from "react-router-dom";
import { useAuthContext } from "../hooks/useAuthContext";
import { useSettings } from "../hooks/useSettings";
import { FiSettings } from "react-icons/fi";
import { PiBarbellDuotone } from "react-icons/pi";
import "./Navbar.css";

function Navbar() {
  const { user } = useAuthContext();
  const { settings, fetchSettings } = useSettings();

  /* eslint-disable react-hooks/exhaustive-deps */

  useEffect(() => {
    const loadSettings = async () => {
      if (user && !settings) {
        try {
          await fetchSettings();
        } catch (error) {
          console.error(error);
        }
      }
    };

    loadSettings();
  }, [user, settings]);

  /* eslint-enable react-hooks/exhaustive-deps */

  return (
    <header className="navbar">
      <div className="container">

        <NavLink className="logo" to="/">
          <PiBarbellDuotone className="logo-icon" />
          <h1>ForgeFit</h1>
        </NavLink>

        <nav className="navbar-nav">

          {user ? (
            <>
              <div className="nav-links">
                <NavLink to="/" end>Dashboard</NavLink>
                <NavLink to="/workouts">Workouts</NavLink>
                <NavLink to="/exercises">Exercises</NavLink>
              </div>

              <NavLink
                to="/settings"
                className="settings-link"
              >
                <span className="settings-text">
                  Settings
                </span>

                <FiSettings className="settings-icon" />
              </NavLink>
            </>
          ) : (
            <div className="nav-links auth-links">
              <NavLink to="/login">Login</NavLink>
              <NavLink to="/signup">Sign Up</NavLink>
            </div>
          )}

        </nav>

      </div>
    </header>
  );
}

export default Navbar;