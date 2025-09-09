import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Signup = () => {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:5000/api/auth/signup", { name, email, address, password });
      alert("Signup successful! Please login.");
      navigate("/login");
    } catch (err) {
      alert(err.response?.data?.message || "Signup failed");
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "#f3f4f6",
        fontFamily: "'Inter', sans-serif",
      }}
    >
      <div
        style={{
          backgroundColor: "#fff",
          padding: "40px 30px",
          borderRadius: "12px",
          boxShadow: "0 8px 20px rgba(0,0,0,0.1)",
          width: "400px",
          textAlign: "center",
        }}
      >
        <h2 style={{ marginBottom: "25px", color: "#6453c1" }}>Sign Up</h2>
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: "15px", textAlign: "left" }}>
            <label style={{ display: "block", marginBottom: "5px", fontWeight: 500, color: "#111827" }}>Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              style={{
                width: "100%",
                padding: "10px",
                borderRadius: "8px",
                border: "1px solid #d1d5db",
                outline: "none",
                transition: "all 0.2s",
              }}
              onFocus={(e) => (e.target.style.borderColor = "#6453c1")}
              onBlur={(e) => (e.target.style.borderColor = "#d1d5db")}
            />
          </div>

          <div style={{ marginBottom: "15px", textAlign: "left" }}>
            <label style={{ display: "block", marginBottom: "5px", fontWeight: 500, color: "#111827" }}>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={{
                width: "100%",
                padding: "10px",
                borderRadius: "8px",
                border: "1px solid #d1d5db",
                outline: "none",
                transition: "all 0.2s",
              }}
              onFocus={(e) => (e.target.style.borderColor = "#6453c1")}
              onBlur={(e) => (e.target.style.borderColor = "#d1d5db")}
            />
          </div>

          <div style={{ marginBottom: "15px", textAlign: "left" }}>
            <label style={{ display: "block", marginBottom: "5px", fontWeight: 500, color: "#111827" }}>Address</label>
            <textarea
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              required
              style={{
                width: "100%",
                padding: "10px",
                borderRadius: "8px",
                border: "1px solid #d1d5db",
                outline: "none",
                transition: "all 0.2s",
                resize: "vertical",
              }}
              onFocus={(e) => (e.target.style.borderColor = "#6453c1")}
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
                borderRadius: "8px",
                border: "1px solid #d1d5db",
                outline: "none",
                transition: "all 0.2s",
              }}
              onFocus={(e) => (e.target.style.borderColor = "#6453c1")}
              onBlur={(e) => (e.target.style.borderColor = "#d1d5db")}
            />
          </div>

          <button
            type="submit"
            style={{
              width: "100%",
              padding: "12px",
              backgroundColor: "#6453c1",
              color: "#fff",
              fontWeight: 600,
              border: "none",
              borderRadius: "8px",
              cursor: "pointer",
              transition: "all 0.3s",
            }}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = "#5140a6";
              e.target.style.transform = "scale(1.02)";
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = "#6453c1";
              e.target.style.transform = "scale(1)";
            }}
          >
            Sign Up
          </button>
        </form>

        <p style={{ marginTop: "20px", fontSize: "14px", color: "#6b7280" }}>
          Already have an account?{" "}
          <a href="/login" style={{ color: "#6453c1", fontWeight: 500, textDecoration: "none" }}>
            Login
          </a>
        </p>
      </div>
    </div>
  );
};

export default Signup;
