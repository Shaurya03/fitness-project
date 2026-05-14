import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSignup } from "../hooks/useSignup";
import "./Signup.css";

function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { signup, error, isLoading } = useSignup();

  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();

    const success = await signup(email, password);

    if (success) {
      setEmail("");
      setPassword("");
      navigate("/");
    }
  };

  return (
    <form className="signup" onSubmit={handleSubmit}>
      <h2>Signup</h2>

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
        {isLoading ? "Signing up..." : "Signup"}
      </button>
    </form>
  );
}

export default Signup;