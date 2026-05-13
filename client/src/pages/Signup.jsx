import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Signup.css";

function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError(null);

    const response = await fetch("http://localhost:5000/api/users/signup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ email, password })
    });

    const json = await response.json();

    console.log(json);

    if (!response.ok) {
      console.log("Signup failed", json.error);
      setError(json.error);
    }

    if (response.ok) {
      localStorage.setItem("user", JSON.stringify(json));
      console.log(JSON.parse(localStorage.getItem("user")));

      setEmail("");
      setPassword("");
      setError(null);
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

      <button type="submit">Signup</button>
    </form>
  );
}

export default Signup;