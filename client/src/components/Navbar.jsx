import { Link } from 'react-router-dom';
import { useAuthContext } from '../hooks/useAuthContext';
import { useLogout } from '../hooks/useLogout';
import './Navbar.css';

function Navbar() {
  const { user } = useAuthContext();
  const { logout } = useLogout();

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
              <button onClick={logout}>Logout</button>
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