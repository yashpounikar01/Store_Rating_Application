import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import Table from "../components/Table";
import AddUserForm from "../components/AddUserForm";
import AddStoreForm from "../components/AddStoreForm";
import { FaSort, FaSortUp, FaSortDown, FaBars } from "react-icons/fa";

const AdminDashboard = () => {
  const { user, logout } = useContext(AuthContext);

  const [activeTab, setActiveTab] = useState("stats");
  const [stats, setStats] = useState({ users: 0, stores: 0, ratings: 0 });
  const [users, setUsers] = useState([]);
  const [stores, setStores] = useState([]);
  const [filters, setFilters] = useState({ name: "", email: "", role: "", address: "" });

  const [showUserModal, setShowUserModal] = useState(false);
  const [showStoreModal, setShowStoreModal] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const [sortConfig, setSortConfig] = useState({ key: "", direction: "asc" });

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const config = { headers: { Authorization: `Bearer ${user.token}` } };

        const statsRes = await axios.get("http://localhost:5000/api/admin/stats", config);
        setStats({
          users: statsRes.data.totalUsers,
          stores: statsRes.data.totalStores,
          ratings: statsRes.data.totalRatings,
        });

        const usersRes = await axios.get("http://localhost:5000/api/admin/users", config);
        setUsers(usersRes.data);

        const storesRes = await axios.get("http://localhost:5000/api/admin/stores", config);
        setStores(storesRes.data);
      } catch (err) {
        console.error(err);
        alert("Error fetching admin data");
      }
    };
    fetchDashboardData();
  }, [user.token]);

  const filteredUsers = users
    .filter(
      (u) =>
        u.name.toLowerCase().includes(filters.name.toLowerCase()) &&
        u.email.toLowerCase().includes(filters.email.toLowerCase()) &&
        u.address.toLowerCase().includes(filters.address.toLowerCase()) &&
        (filters.role ? u.role === filters.role : true)
    )
    .sort((a, b) => {
      if (!sortConfig.key) return 0;
      const valA = a[sortConfig.key];
      const valB = b[sortConfig.key];
      if (valA < valB) return sortConfig.direction === "asc" ? -1 : 1;
      if (valA > valB) return sortConfig.direction === "asc" ? 1 : -1;
      return 0;
    });

  const storeColumns = [
    { key: "name", label: "Store Name" },
    { key: "email", label: "Email" },
    { key: "address", label: "Address" },
    { key: "avgRating", label: "Avg Rating" },
    { key: "owner_name", label: "Owner Name" },
  ];

  const handleSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") direction = "desc";
    setSortConfig({ key, direction });
  };

  return (
    <div style={{ display: "flex", minHeight: "100vh", fontFamily: "'Inter', sans-serif", paddingBottom:"70px" }}>
      {/* Sidebar */}
      <div
        style={{
          width: sidebarOpen ? "220px" : "60px",
          backgroundColor: "#1f2937",
          color: "#fff",
          display: "flex",
          flexDirection: "column",
          padding: "20px",
          transition: "width 0.3s",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          {sidebarOpen && <h2 style={{ color: "#f97316", fontSize: "22px" }}>Admin Panel</h2>}
          <button onClick={() => setSidebarOpen(!sidebarOpen)} style={sidebarToggle}>
            <FaBars />
          </button>
        </div>
        <div style={{ marginTop: "40px", display: "flex", flexDirection: "column", gap: "10px" }}>
          {["stats", "users", "stores"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              style={{
                ...sidebarButton,
                backgroundColor: activeTab === tab ? "#f97316" : "transparent",
                justifyContent: sidebarOpen ? "flex-start" : "center",
              }}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div style={{ flex: 1, background: "#f3f4f6", padding: "30px", transition: "margin-left 0.3s" }}>
        <h1 style={{ marginBottom: "30px", color: "#111827" }}>Welcome, {user.name}</h1>

        {activeTab === "stats" && (
          <div>
            <h2 style={{ marginBottom: "20px" }}>Dashboard Stats</h2>
            <div style={{ display: "flex", gap: "20px", flexWrap: "wrap" }}>
              <StatCard title="Users" value={stats.users} color="#4ade80" />
              <StatCard title="Stores" value={stats.stores} color="#60a5fa" />
              <StatCard title="Ratings" value={stats.ratings} color="#facc15" />
            </div>
          </div>
        )}

        {activeTab === "users" && (
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <h2 style={{ marginBottom: "15px" }}>Users</h2>
              <button onClick={() => setShowUserModal(true)} style={addButtonStyle}>
                + Add User
              </button>
            </div>
            <div style={{ display: "flex", gap: "10px", marginBottom: "15px", flexWrap: "wrap" }}>
              <input
                placeholder="Filter by name"
                style={filterInput}
                onChange={(e) => setFilters({ ...filters, name: e.target.value })}
              />
              <input
                placeholder="Filter by email"
                style={filterInput}
                onChange={(e) => setFilters({ ...filters, email: e.target.value })}
              />
              <input
                placeholder="Filter by address"
                style={filterInput}
                onChange={(e) => setFilters({ ...filters, address: e.target.value })}
              />
              <select onChange={(e) => setFilters({ ...filters, role: e.target.value })} style={filterInput}>
                <option value="">All Roles</option>
                <option value="admin">Admin</option>
                <option value="user">Normal User</option>
                <option value="store_owner">Store Owner</option>
              </select>
            </div>
            <Table
              columns={userColumns.map((col) => ({
                ...col,
                sortable: true,
                onClick: () => handleSort(col.key),
                sortDirection: sortConfig.key === col.key ? sortConfig.direction : null,
              }))}
              data={filteredUsers}
            />
          </div>
        )}

        {activeTab === "stores" && (
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <h2 style={{ marginBottom: "15px" }}>Stores</h2>
              <button onClick={() => setShowStoreModal(true)} style={addButtonStyle}>
                + Add Store
              </button>
            </div>
            <Table columns={storeColumns} data={stores} />
          </div>
        )}

        {/* Modals */}
        {showUserModal && (
          <Modal onClose={() => setShowUserModal(false)}>
            <AddUserForm onClose={() => setShowUserModal(false)} />
          </Modal>
        )}
        {showStoreModal && (
          <Modal onClose={() => setShowStoreModal(false)}>
            <AddStoreForm onClose={() => setShowStoreModal(false)} />
          </Modal>
        )}
      </div>
    </div>
  );
};

// Modal Component
const Modal = ({ children, onClose }) => (
  <div style={modalOverlay}>
    <div style={modalContent}>
      <button onClick={onClose} style={modalCloseButton}>
        ×
      </button>
      {children}
    </div>
  </div>
);

const StatCard = ({ title, value, color }) => (
  <div
    style={{
      background: color + "33",
      padding: "25px",
      borderRadius: "12px",
      flex: "1 1 200px",
      textAlign: "center",
      fontWeight: 600,
      boxShadow: "0 6px 20px rgba(0,0,0,0.1)",
      fontSize: "18px",
      transition: "transform 0.2s",
    }}
    onMouseEnter={(e) => (e.currentTarget.style.transform = "translateY(-5px)")}
    onMouseLeave={(e) => (e.currentTarget.style.transform = "translateY(0)")}
  >
    <div style={{ fontSize: "32px", marginBottom: "10px" }}>{value}</div>
    <div>{title}</div>
  </div>
);

// Styles
const sidebarButton = {
  padding: "12px 15px",
  marginBottom: "10px",
  textAlign: "left",
  border: "none",
  borderRadius: "8px",
  cursor: "pointer",
  color: "#fff",
  fontWeight: 500,
  display: "flex",
  alignItems: "center",
  gap: "10px",
  transition: "all 0.2s",
};
const sidebarToggle = {
  background: "none",
  border: "none",
  color: "#fff",
  cursor: "pointer",
  fontSize: "20px",
};
const logoutButton = {
  padding: "12px",
  backgroundColor: "#ef4444",
  border: "none",
  borderRadius: "8px",
  cursor: "pointer",
  fontWeight: 500,
  color: "#fff",
};
const addButtonStyle = {
  padding: "10px 20px",
  backgroundColor: "#10b981",
  border: "none",
  borderRadius: "8px",
  color: "#fff",
  cursor: "pointer",
  fontWeight: 600,
  transition: "all 0.2s",
};
const filterInput = {
  padding: "8px 12px",
  borderRadius: "8px",
  border: "1px solid #d1d5db",
  outline: "none",
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
  zIndex: 9999,
};
const modalContent = {
  backgroundColor: "#fff",
  borderRadius: "12px",
  padding: "30px",
  width: "500px",
  maxHeight: "80vh",
  overflowY: "auto",
  position: "relative",
};
const modalCloseButton = {
  position: "absolute",
  top: "10px",
  right: "15px",
  fontSize: "24px",
  background: "none",
  border: "none",
  cursor: "pointer",
  fontWeight: 600,
};
const userColumns = [
  { key: "name", label: "Name" },
  { key: "email", label: "Email" },
  { key: "address", label: "Address" },
  { key: "role", label: "Role" },
];

export default AdminDashboard;
