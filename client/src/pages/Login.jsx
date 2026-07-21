import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { PiBarbellDuotone, PiEye, PiEyeSlash } from "react-icons/pi";
import { GoogleLogin } from "@react-oauth/google";
import { useLogin } from "../hooks/useLogin";
import { useGoogleAuth } from "../hooks/useGoogleAuth";
import "./Auth.css";

function Login() {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] =
    useState(false);

  const {
    login,
    error,
    isLoading
  } = useLogin();

  const {
    googleAuth,
    error: googleError
  } = useGoogleAuth();

  const navigate = useNavigate();

  const handleLogin = async (event) => {

    event.preventDefault();

    const success = await login(
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
        onSubmit={handleLogin}
      >

        <div className="auth-header">

          <PiBarbellDuotone className="auth-logo" />

          <h2>Welcome back</h2>

          <p>
            Continue forging your progress.
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
              placeholder="Enter your password"
              value={password}
              onChange={(event) =>
                setPassword(event.target.value)
              }
            />

            <button
              type="button"
              className="password-toggle"
              onClick={() =>
                setShowPassword(
                  current => !current
                )
              }
            >
              {showPassword
                ? <PiEyeSlash />
                : <PiEye />}
            </button>

          </div>

        </div>

        {(error || googleError) && (
          <div className="auth-error">
            {error || googleError}
          </div>
        )}

        <button
          className="auth-btn"
          type="submit"
          disabled={isLoading}
        >
          {isLoading
            ? "Signing in..."
            : "Sign In"}
        </button>

        <div className="auth-divider">
          <span>or</span>
        </div>

        <div className="google-login-wrapper">
          <GoogleLogin
            onSuccess={async (credentialResponse) => {
              await googleAuth(
                credentialResponse.credential
              );
            }}
            text="continue_with"
            theme="filled_black"
            shape="rectangular"
            size="large"
            width="100%"
            useOneTap={false}
          />
        </div>

        <p className="auth-footer">

          Don't have an account?

          <Link to="/signup">
            Create Account
          </Link>

        </p>

      </form>

    </div>
  );
}

export default Login;