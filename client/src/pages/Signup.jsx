import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  PiBarbellDuotone,
  PiEye,
  PiEyeSlash
} from "react-icons/pi";
import { FcGoogle } from "react-icons/fc";
import { useSignup } from "../hooks/useSignup";
import "./Signup.css";

function Signup() {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] =
    useState(false);

  const {
    signup,
    error,
    isLoading
  } = useSignup();

  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();

    const success = await signup(
      email,
      password
    );

    if (success) {
      setEmail("");
      setPassword("");

      navigate("/");
    }
  };

  return (
    <div className="auth-page">

      <form
        className="auth-card"
        onSubmit={handleSubmit}
      >

        <div className="auth-header">

          <PiBarbellDuotone className="auth-logo" />

          <h2>Create your account</h2>

          <p>
            Forge your strongest self.
          </p>

        </div>

        <div className="auth-field">

          <label>Email address</label>

          <input
            required
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(event) =>
              setEmail(event.target.value)
            }
          />

        </div>

        <div className="auth-field">

          <label>Password</label>

          <div className="password-input">

            <input
              required
              type={
                showPassword
                  ? "text"
                  : "password"
              }
              placeholder="Create a password"
              value={password}
              onChange={(event) =>
                setPassword(event.target.value)
              }
            />

            <button
              type="button"
              className="password-toggle"
              onClick={() =>
                setShowPassword(current => !current)
              }
            >
              {showPassword
                ? <PiEyeSlash />
                : <PiEye />}
            </button>

          </div>

        </div>

        {error && (
          <div className="auth-error">
            {error}
          </div>
        )}

        <button
          className="auth-btn"
          type="submit"
          disabled={isLoading}
        >
          {isLoading
            ? "Creating account..."
            : "Create Account"}
        </button>

        <div className="auth-divider">
          <span>or</span>
        </div>

        <button
          type="button"
          className="google-btn"
          disabled
        >
          <FcGoogle />

          Continue with Google
        </button>

        <p className="auth-footer">

          Already have an account?

          <Link to="/login">
            Sign In
          </Link>

        </p>

      </form>

    </div>
  );
}

export default Signup;