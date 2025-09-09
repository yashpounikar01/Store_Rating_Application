import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const Login = () => {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const userData = await login(email, password);

      // Redirect based on role
      if (userData.role === "user") navigate("/user/dashboard");
      else if (userData.role === "store_owner") navigate("/store/dashboard");
      else if (userData.role === "admin") navigate("/admin/dashboard");
    } catch (err) {
      alert(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        fontFamily: "'Inter', sans-serif",
      }}
    >
      <div
        style={{
          backgroundColor: "#fff",
          padding: "40px 30px",
          borderRadius: "15px",
          boxShadow: "0 10px 25px rgba(0,0,0,0.15)",
          width: "350px",
          textAlign: "center",
        }}
      >
        <h2 style={{ marginBottom: "25px", color: "#4f46e5" }}>Login</h2>
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: "20px", textAlign: "left" }}>
            <label style={{ display: "block", marginBottom: "5px", fontWeight: 500, color: "#111827" }}>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={{
                width: "100%",
                padding: "10px",
                borderRadius: "10px",
                border: "1px solid #d1d5db",
                outline: "none",
                transition: "all 0.2s",
              }}
              onFocus={(e) => (e.target.style.borderColor = "#4f46e5")}
              onBlur={(e) => (e.target.style.borderColor = "#d1d5db")}
            />
          </div>

          <div style={{ marginBottom: "25px", textAlign: "left" }}>
            <label style={{ display: "block", marginBottom: "5px", fontWeight: 500, color: "#111827" }}>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={{
                width: "100%",
                padding: "10px",
                borderRadius: "10px",
                border: "1px solid #d1d5db",
                outline: "none",
                transition: "all 0.2s",
              }}
              onFocus={(e) => (e.target.style.borderColor = "#4f46e5")}
              onBlur={(e) => (e.target.style.borderColor = "#d1d5db")}
            />
          </div>

          <button
            type="submit"
            style={{
              width: "100%",
              padding: "12px",
              backgroundColor: "#4f46e5",
              color: "#fff",
              fontWeight: 600,
              border: "none",
              borderRadius: "10px",
              cursor: "pointer",
              transition: "all 0.3s",
            }}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = "#4338ca";
              e.target.style.transform = "scale(1.02)";
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = "#4f46e5";
              e.target.style.transform = "scale(1)";
            }}
          >
            Login
          </button>
        </form>

        <p style={{ marginTop: "20px", fontSize: "14px", color: "#6b7280" }}>
          Don't have an account?{" "}
          <a href="/signup" style={{ color: "#4f46e5", fontWeight: 500, textDecoration: "none" }}>
            Sign Up
          </a>
        </p>
      </div>
    </div>
  );
};

export default Login;
