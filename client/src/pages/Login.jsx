import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLogin } from "../hooks/useLogin";
import "./Login.css";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login, error, isLoading } = useLogin();

  const navigate = useNavigate();

  const handleLogin = async (event) => {
    event.preventDefault();

    const success = await login(email, password);

    if (success) {
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
      <button type="submit" disabled={isLoading}>
        {isLoading ? "Logging in..." : "Login"}
      </button>
    </form>
  );
}

export default Login;
      