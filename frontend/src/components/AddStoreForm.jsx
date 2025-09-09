import React, { useState, useContext, useEffect } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";

const AddStoreForm = ({ onClose }) => {
  const { user } = useContext(AuthContext);
  const [form, setForm] = useState({ name: "", email: "", address: "", owner_id: "" });
  const [storeOwners, setStoreOwners] = useState([]);

  // Fetch existing store owners
  useEffect(() => {
    const fetchOwners = async () => {
      try {
        const config = { headers: { Authorization: `Bearer ${user.token}` } };
        const res = await axios.get("http://localhost:5000/api/admin/users", config);
        setStoreOwners(res.data.filter((u) => u.role === "store_owner"));
      } catch (err) {
        console.error(err);
      }
    };
    fetchOwners();
  }, [user.token]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      const res = await axios.post("http://localhost:5000/api/admin/stores", form, config);
      alert(res.data.message);
      setForm({ name: "", email: "", address: "", owner_id: "" });
      if (onClose) onClose(); // close modal after submit
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Error adding store");
    }
  };

  return (
    <form onSubmit={handleSubmit} style={formContainer}>
      <h2 style={formTitle}>Add New Store</h2>

      <input
        name="name"
        value={form.name}
        onChange={handleChange}
        placeholder="Store Name"
        required
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
      <input
        name="address"
        value={form.address}
        onChange={handleChange}
        placeholder="Address"
        required
        style={inputStyle}
      />
      <select
        name="owner_id"
        value={form.owner_id}
        onChange={handleChange}
        style={inputStyle}
      >
        <option value="">Assign Owner (Optional)</option>
        {storeOwners.map((o) => (
          <option key={o.id} value={o.id}>
            {o.name}
          </option>
        ))}
      </select>

      <div style={{ display: "flex", justifyContent: "space-between", marginTop: "20px" }}>
        <button type="submit" style={submitButton}>
          Add Store
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

// Styles (same as AddUserForm for consistency)
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
  backgroundColor: "#3b82f6",
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

export default AddStoreForm;
