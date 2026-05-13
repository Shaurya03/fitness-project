import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthContext } from "../hooks/useAuthContext";
import "./Login.css";

function Login() {
  const { dispatch } = useAuthContext();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  const handleLogin = async (event) => {
    event.preventDefault();

    setError(null);

    const response = await fetch("http://localhost:5000/api/users/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ email, password })
    });

    const json = await response.json();

    if (!response.ok) {
      setError(json.error);
    }

    if (response.ok) {
      localStorage.setItem("user", JSON.stringify(json));
      dispatch({ type: "LOGIN", payload: json });
      setError(null);
      setEmail("");
      setPassword("");
      navigate("/");
    }
  };

  return (
    <form className="login" onSubmit={handleLogin}>
      <h2>Login</h2>
      <label>Email:</label>
      <input 
        required
        type="email"
        value={email}
        onChange={(event) => setEmail(event.target.value)}
      />
      <label>Password:</label>
      <input 
        required
        type="password"
        value={password}
        onChange={(event) => setPassword(event.target.value)}
      />
      {error && <div className="error">{error}</div>}
      <button type="submit">Login</button>
    </form>
  );
}

export default Login;