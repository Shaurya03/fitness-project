import { Link } from 'react-router-dom';
import { useAuthContext } from '../hooks/useAuthContext';
import './Navbar.css';

function Navbar() {
  const { user, dispatch } = useAuthContext();

  const handleLogout = () => {
    localStorage.removeItem("user");
    dispatch({ type: "LOGOUT" });
  };

  return (
    <header className="navbar">
      <div className="container">
        <Link to="/">
          <h1>Fitness Tracker</h1>
        </Link>

        <nav>
          {user ? (
            <div>
              <span>{user.email}</span>
              <button onClick={handleLogout}>Logout</button>
            </div>
          ) : (
            <div>
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