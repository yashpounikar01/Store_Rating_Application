import React, { useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";

const AddUserForm = ({ onClose }) => {
  const { user } = useContext(AuthContext);
  const [form, setForm] = useState({
    name: "",
    email: "",
    address: "",
    password: "",
    role: "user",
  });

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();

    // --- Validation before sending to backend ---
    if (form.name.length < 20 || form.name.length > 60) {
      return alert("Name must be between 20 and 60 characters.");
    }
    if (form.address.length > 400) {
      return alert("Address cannot exceed 400 characters.");
    }
    const passwordRegex =
      /^(?=.*[A-Z])(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,16}$/;
    if (!passwordRegex.test(form.password)) {
      return alert(
        "Password must be 8-16 characters, include at least one uppercase letter and one special character."
      );
    }

    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      const res = await axios.post(
        "http://localhost:5000/api/admin/users",
        form,
        config
      );
      alert(res.data.message);
      setForm({ name: "", email: "", address: "", password: "", role: "user" });
      if (onClose) onClose(); // close modal after submit
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Error adding user");
    }
  };

  return (
    <form onSubmit={handleSubmit} style={formContainer}>
      <h2 style={formTitle}>Add New User</h2>

      <input
        name="name"
        value={form.name}
        onChange={handleChange}
        placeholder="Full Name (20–60 characters)"
        required
        minLength={20}
        maxLength={60}
        style={inputStyle}
      />

      <input
        name="email"
        type="email"
        value={form.email}
        onChange={handleChange}
        placeholder="Email Address"
        required
        style={inputStyle}
      />

      <textarea
        name="address"
        value={form.address}
        onChange={handleChange}
        placeholder="Address (max 400 characters)"
        required
        maxLength={400}
        style={inputStyle}
      />

      <input
        name="password"
        type="password"
        value={form.password}
        onChange={handleChange}
        placeholder="Password (8–16 chars, 1 uppercase, 1 special)"
        required
        minLength={8}
        maxLength={16}
        pattern="^(?=.*[A-Z])(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,16}$"
        title="Password must be 8-16 characters, include at least one uppercase letter and one special character."
        style={inputStyle}
      />

      <select
        name="role"
        value={form.role}
        onChange={handleChange}
        style={inputStyle}
      >
        <option value="user">Normal User</option>
        <option value="admin">Admin</option>
        <option value="store_owner">Store Owner</option>
      </select>

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginTop: "20px",
        }}
      >
        <button type="submit" style={submitButton}>
          Add User
        </button>
        {onClose && (
          <button type="button" onClick={onClose} style={cancelButton}>
            Cancel
          </button>
        )}
      </div>
    </form>
  );
};

// Styles
const formContainer = {
  display: "flex",
  flexDirection: "column",
  gap: "15px",
  backgroundColor: "#fff",
  padding: "30px",
  borderRadius: "12px",
  boxShadow: "0 8px 25px rgba(0,0,0,0.15)",
  width: "100%",
  maxWidth: "450px",
};

const formTitle = {
  fontSize: "24px",
  fontWeight: "600",
  color: "#111827",
  marginBottom: "10px",
  textAlign: "center",
};

const inputStyle = {
  padding: "12px 15px",
  borderRadius: "8px",
  border: "1px solid #d1d5db",
  outline: "none",
  fontSize: "16px",
  transition: "all 0.2s",
};

const submitButton = {
  backgroundColor: "#10b981",
  color: "#fff",
  border: "none",
  borderRadius: "8px",
  padding: "12px 20px",
  cursor: "pointer",
  fontWeight: "600",
  fontSize: "16px",
  transition: "all 0.2s",
};

const cancelButton = {
  backgroundColor: "#ef4444",
  color: "#fff",
  border: "none",
  borderRadius: "8px",
  padding: "12px 20px",
  cursor: "pointer",
  fontWeight: "600",
  fontSize: "16px",
  transition: "all 0.2s",
};

export default AddUserForm;
