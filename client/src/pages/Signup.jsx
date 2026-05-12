import { useState } from "react";
import "./Signup.css";

function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();

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
      console.log("Signup failed");
    }

    if (response.ok) {
      localStorage.setItem("user", JSON.stringify(json));
      console.log(JSON.parse(localStorage.getItem("user")));
    }
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