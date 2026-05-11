import { useState } from "react";
import "./Signup.css";

function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();

    console.log(email, password);
  };

  return (
    <form className="signup" onSubmit={handleSubmit}>
      <h2>Signup</h2>

      <label>Email:</label>
      <input
        type="email"
        value={email}
        onChange={(event) => setEmail(event.target.value)}
      />

      <label>Password:</label>
      <input
        type="password"
        value={password}
        onChange={(event) => setPassword(event.target.value)}
      />

      <button type="submit">Signup</button>
    </form>
  );
}

export default Signup;