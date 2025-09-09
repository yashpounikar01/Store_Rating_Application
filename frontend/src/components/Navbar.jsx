import React, { useContext, useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import axios from "axios";

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const [showDropdown, setShowDropdown] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);

  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [profile, setProfile] = useState({ name: "", email: "", address: "" });

  const [toast, setToast] = useState({ message: "", type: "" }); // for notifications

  // Load initial profile
  useEffect(() => {
    if (user) {
      setProfile({ name: user.name || "", email: user.email || "", address: user.address || "" });
    }
  }, [user]);

  // Fetch store address for store owners
useEffect(() => {
  const fetchStoreAddress = async () => {
    if (user?.role === "store_owner") {
      try {
        const config = { headers: { Authorization: `Bearer ${user.token}` } };
        const res = await axios.get("http://localhost:5000/api/stores/my-store", config);
        // Set the address from backend
        setProfile((prev) => ({ ...prev, address: res.data.address || "" }));
      } catch (err) {
        console.error("Error fetching store address:", err);
      }
    }
  };
  fetchStoreAddress();
}, [user]);


  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      const res = await axios.put("http://localhost:5000/api/auth/update", profile, config);
      console.log("Profile update response:", res.data);
      setToast({ message: res.data.message, type: "success" });
      setShowProfileModal(false);
    } catch (err) {
      console.error("Profile update error:", err.response?.data?.message || err.message);
      setToast({ message: err.response?.data?.message || "Failed to update profile", type: "error" });
    }

    // auto-hide toast
    setTimeout(() => setToast({ message: "", type: "" }), 3000);
  };

  const handleUpdatePassword = async (e) => {
    e.preventDefault();
    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      const res = await axios.patch(
        "http://localhost:5000/api/auth/password",
        { oldPassword, newPassword },
        config
      );
      setToast({ message: res.data.message, type: "success" });
      setOldPassword("");
      setNewPassword("");
      setShowPasswordModal(false);
      setTimeout(() => setToast({ message: "", type: "" }), 3000);
    } catch (err) {
      setToast({ message: err.response?.data?.message || "Failed to update password", type: "error" });
      setTimeout(() => setToast({ message: "", type: "" }), 3000);
    }
  };

  return (
    <nav style={navStyle}>
      {/* Heading */}
      <span style={{ ...headingStyle, cursor: !user ? "pointer" : "default" }} onClick={() => !user && navigate("/")}>
        Store Ratings
      </span>

      <div style={{ display: "flex", alignItems: "center" }}>
        {!user && (
          <>
            <Link to="/login" style={btnLogin}>Login</Link>
            <Link to="/signup" style={btnSignup}>Sign Up</Link>
          </>
        )}

        {user && (
          <div style={{ position: "relative", marginLeft: "20px" }}>
            {/* Profile Icon */}
            <div onClick={() => setShowDropdown(!showDropdown)} style={profileIconStyle} title={user.name}>
              {user.name[0].toUpperCase()}
            </div>

            {/* Dropdown */}
            {showDropdown && (
              <div style={dropdownStyle}>
                <div style={dropdownItem} onClick={() => { setShowProfileModal(true); setShowDropdown(false); }}>
                  Update Profile
                </div>
                <div style={dropdownItem} onClick={() => { setShowPasswordModal(true); setShowDropdown(false); }}>
                  Update Password
                </div>
                <div onClick={logout} style={{ ...dropdownItem, color: "#ef4444", borderTop: "1px solid #e5e7eb" }}>
                  Logout
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Password Modal */}
      {showPasswordModal && (
        <Modal title="Update Password" onClose={() => setShowPasswordModal(false)}>
          <form onSubmit={handleUpdatePassword}>
            <input type="password" placeholder="Old Password" value={oldPassword} onChange={(e) => setOldPassword(e.target.value)} required style={modalInput} />
            <input type="password" placeholder="New Password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} required style={modalInput} />
            <button type="submit" style={modalButton}>Update</button>
          </form>
        </Modal>
      )}

      {/* Profile Modal */}
      {showProfileModal && (
        <Modal title="Update Profile" onClose={() => setShowProfileModal(false)}>
          <form onSubmit={handleUpdateProfile}>
            <input type="text" placeholder="Name" value={profile.name} onChange={(e) => setProfile({ ...profile, name: e.target.value })} required style={modalInput} />
            <input type="email" placeholder="Email" value={profile.email} onChange={(e) => setProfile({ ...profile, email: e.target.value })} required style={modalInput} />
            <input type="text" placeholder="Address" value={profile.address || ""} onChange={(e) => setProfile({ ...profile, address: e.target.value })} required style={modalInput} />
            <button type="submit" style={modalButton}>Update</button>
          </form>
        </Modal>
      )}

      {/* Toast Notification */}
      {toast.message && (
        <div style={{ ...toastStyle, backgroundColor: toast.type === "success" ? "#4ade80" : "#f87171" }}>
          {toast.message}
        </div>
      )}
    </nav>
  );
};

// Modal Component
const Modal = ({ children, title, onClose }) => (
  <div style={modalOverlay}>
    <div style={modalContent}>
      <button onClick={onClose} style={modalCloseButton}>&times;</button>
      <h3 style={{ textAlign: "center", marginBottom: "15px", color: "#111827" }}>{title}</h3>
      {children}
    </div>
  </div>
);

// Toast Style
const toastStyle = {
  position: "fixed",
  bottom: "20px",
  left: "20px",
  padding: "10px 20px",
  borderRadius: "8px",
  color: "#fff",
  fontWeight: 600,
  boxShadow: "0 2px 6px rgba(0,0,0,0.2)",
  zIndex: 2000,
};

// Styles
const navStyle = {
  padding: "10px 50px",
  borderBottom: "1px solid #e5e7eb",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  fontFamily: "'Inter', sans-serif",
  position: "sticky",
  top: 0,
  backgroundColor: "#fff",
  zIndex: 50,
  boxShadow: "0 2px 6px rgba(0,0,0,0.05)",
};

const headingStyle = {
  fontWeight: 700,
  fontSize: "1.5rem",
  color: "#4f46e5",
};

const btnLogin = {
  marginRight: "15px",
  padding: "8px 20px",
  borderRadius: "8px",
  textDecoration: "none",
  color: "#4f46e5",
  fontWeight: 600,
  border: "2px solid #4f46e5",
  transition: "all 0.3s ease",
};

const btnSignup = {
  padding: "8px 20px",
  borderRadius: "8px",
  textDecoration: "none",
  backgroundColor: "#4f46e5",
  color: "#fff",
  fontWeight: 600,
  transition: "all 0.3s ease",
};

const profileIconStyle = {
  width: "40px",
  height: "40px",
  borderRadius: "50%",
  backgroundColor: "#4f46e5",
  color: "#fff",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  cursor: "pointer",
  fontWeight: "bold",
  fontSize: "1rem",
  textTransform: "uppercase",
  boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
  transition: "transform 0.2s",
};

const dropdownStyle = {
  position: "absolute",
  right: 0,
  top: "50px",
  backgroundColor: "#fff",
  borderRadius: "12px",
  boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
  width: "200px",
  zIndex: 100,
  overflow: "hidden",
};

const dropdownItem = {
  padding: "12px 15px",
  cursor: "pointer",
  color: "#111827",
  fontWeight: 500,
  transition: "background 0.2s",
  backgroundColor: "white",
};

const modalOverlay = {
  position: "fixed",
  top: 0,
  left: 0,
  width: "100vw",
  height: "100vh",
  backgroundColor: "rgba(0,0,0,0.5)",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  zIndex: 1000,
};

const modalContent = {
  backgroundColor: "#fff",
  padding: "25px 20px",
  borderRadius: "15px",
  width: "320px",
  boxShadow: "0 10px 25px rgba(0,0,0,0.2)",
  position: "relative",
};

const modalCloseButton = {
  position: "absolute",
  top: "10px",
  right: "12px",
  background: "transparent",
  border: "none",
  fontSize: "20px",
  cursor: "pointer",
  color: "#6b7280",
};

const modalInput = {
  marginBottom: "12px",
  padding: "10px",
  width: "100%",
  borderRadius: "10px",
  border: "1px solid #d1d5db",
  outline: "none",
};

const modalButton = {
  padding: "10px",
  width: "100%",
  borderRadius: "10px",
  border: "none",
  backgroundColor: "#4f46e5",
  color: "#fff",
  fontWeight: 600,
  cursor: "pointer",
  transition: "opacity 0.2s",
};

export default Navbar;
