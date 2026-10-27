
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../services/api";

function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (event) => {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await api.post("/auth/login", {
        email: email.trim(),
        password,
      });

      if (!response.data.token) {
        setError("Login failed. No authentication token received.");
        return;
      }

      localStorage.setItem("token", response.data.token);
      navigate("/", { replace: true });
    } catch (err) {
  console.error("Login error:", err.response?.data || err.message);

  setError(
    err.response?.data?.message ||
      (err.response
        ? `Login failed (${err.response.status}).`
        : "Cannot connect to the backend. Check that it is running.")
  );
      }     finally {
      setLoading(false);
    }

  };

  return (
    <main className="auth-page">
      <div className="auth-decoration auth-decoration-one" />
      <div className="auth-decoration auth-decoration-two" />

      <form className="auth-card" onSubmit={handleLogin}>
        <div className="auth-brand">
          <span className="auth-brand-icon">C</span>
          <span>ChatSpace</span>
        </div>

        <div className="auth-heading">
          <h1>Welcome back.</h1>
          <p>Log in to continue your conversations.</p>
        </div>

        <div className="auth-fields">
          <div className="auth-field">
            <label htmlFor="login-email">Email address</label>
            <input
              id="login-email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              autoComplete="email"
              required
            />
          </div>

          <div className="auth-field">
            <label htmlFor="login-password">Password</label>
            <input
              id="login-password"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              autoComplete="current-password"
              required
            />
          </div>
        </div>

        {error && <div className="auth-error">{error}</div>}

        <button className="auth-submit" type="submit" disabled={loading}>
          {loading ? "Logging in..." : "Log in"}
          {!loading && <span aria-hidden="true"> →</span>}
        </button>

        <p className="auth-footer">
          Don't have an account? <Link to="/register">Create one</Link>
        </p>

        <div className="auth-bottom-note">
          Simple conversations. Real connections.
        </div>
      </form>
    </main>
  );
}

export default Login;
