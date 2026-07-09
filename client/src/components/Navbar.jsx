import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuthContext } from '../hooks/useAuthContext';
import { useLogout } from '../hooks/useLogout';
import { useSettings } from '../hooks/useSettings';
import './Navbar.css';

function Navbar() {
  const { user } = useAuthContext();
  const { logout } = useLogout();
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
        <Link to="/">
          <h1>Fitness Tracker</h1>
        </Link>

        <nav>
          {user ? (
            <div className="nav-links">
              <Link to="/">Dashboard</Link>
              <Link to="/workouts">Workouts</Link>
              <Link to="/exercises">Exercises</Link>
              <Link to="/settings">Settings</Link>

              <span>{user.email}</span>

              <button onClick={logout}>Logout</button>
            </div>
          ) : (
            <div className="nav-links">
              <Link to="/login">Login</Link>
              <Link to="/signup">Signup</Link>
            </div>
          )}
        </nav>
      </div>
    </header>
  );
}

export default Navbar;