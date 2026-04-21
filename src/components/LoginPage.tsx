import React, { useState } from "react";

type Props = {
  onClose: () => void;
  onLoginSuccess: (payload: {
    username: string;
    firstName: string;
    lastName: string;
    accessToken: string;
    refreshToken: string;
  }) => void;
};

interface CurrentUserResponse {
  username: string;
  first_name?: string;
  last_name?: string;
}

const LoginPage: React.FC<Props> = ({ onClose, onLoginSuccess }) => {
  const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || "";
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const res = await fetch(`${API_BASE_URL}/api/token/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();

      if (res.ok) {
        let currentUser: CurrentUserResponse = {
          username,
          first_name: "",
          last_name: "",
        };

        try {
          const userRes = await fetch(`${API_BASE_URL}/api/me/`, {
            headers: {
              Authorization: `Bearer ${data.access}`,
            },
          });

          if (userRes.ok) {
            currentUser = await userRes.json();
          }
        } catch {
          currentUser = {
            username,
            first_name: "",
            last_name: "",
          };
        }

        onLoginSuccess({
          username: currentUser.username || username,
          firstName: currentUser.first_name || "",
          lastName: currentUser.last_name || "",
          accessToken: data.access,
          refreshToken: data.refresh,
        });
        onClose();
      } else {
        alert(data.detail || data.error || "Login failed");
      }
    } catch {
      alert("Server error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center"
      style={{ backgroundColor: "rgba(0,0,0,0.5)", zIndex: 2000 }}
    >
      <div className="bg-white p-4 rounded shadow" style={{ maxWidth: "400px", width: "100%" }}>
        <div className="d-flex justify-content-between mb-3">
          <h4>Login</h4>
          <button className="btn btn-sm btn-outline-secondary" onClick={onClose}>
            X
          </button>
        </div>

        <form onSubmit={handleLogin}>
          <div className="mb-3">
            <input
              type="text"
              className="form-control"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Username"
              required
            />
          </div>

          <div className="mb-3">
            <input
              type="password"
              className="form-control"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="btn btn-primary w-100" disabled={isSubmitting}>
            {isSubmitting ? "Signing in..." : "Sign in"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
