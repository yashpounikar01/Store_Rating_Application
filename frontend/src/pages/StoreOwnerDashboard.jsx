import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import Table from "../components/Table";

const StoreOwnerDashboard = () => {
  const { user } = useContext(AuthContext);
  const [ratings, setRatings] = useState([]);
  const [avgRating, setAvgRating] = useState(null);

  useEffect(() => {
    fetchStoreData();
  }, [user.token]);

  const fetchStoreData = async () => {
    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      const res = await axios.get("http://localhost:5000/api/stores/dashboard", config);
      setRatings(res.data.raters || []);
      setAvgRating(res.data.averageRating || 0);
    } catch (err) {
      console.error(err);
      alert("Error fetching store data");
    }
  };

  const columns = [
    { key: "userName", label: "User Name" },
    { key: "userEmail", label: "Email" },
    { key: "rating", label: "Rating" },
    { key: "comment", label: "Comment" },
  ];

  return (
    <div style={{ padding: "30px", fontFamily: "'Inter', sans-serif", background: "#f3f4f6", minHeight: "100vh", paddingBottom:"70px" }}>
      <h1 style={{ color: "#111827", marginBottom: "30px" }}>Welcome, {user.name}</h1>

      {/* Stats Cards */}
      <div style={{ display: "flex", gap: "20px", flexWrap: "wrap", marginBottom: "40px" }}>
        <StatCard title="Average Rating" value={avgRating || "N/A"} color="#facc15" />
        <StatCard title="Total Ratings" value={ratings.length} color="#60a5fa" />
      </div>

      {/* User Ratings Table */}
      <div>
        <h2 style={{ marginBottom: "20px", color: "#111827" }}>User Ratings</h2>
        <Table columns={columns} data={ratings} />
      </div>
    </div>
  );
};

// Stat Card Component
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
      cursor: "default",
    }}
    onMouseEnter={(e) => (e.currentTarget.style.transform = "translateY(-5px)")}
    onMouseLeave={(e) => (e.currentTarget.style.transform = "translateY(0)")}
  >
    <div style={{ fontSize: "32px", marginBottom: "10px" }}>{value}</div>
    <div>{title}</div>
  </div>
);

export default StoreOwnerDashboard;
