import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import StoreCard from "../components/StoreCard";

const UserDashboard = () => {
  const { user } = useContext(AuthContext);

  const [stores, setStores] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (user?.token) fetchStores();
  }, [user?.token]);

  const fetchStores = async () => {
    setLoading(true);
    setError("");
    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      const res = await axios.get("http://localhost:5000/api/stores", config);
      setStores(res.data || []);
    } catch (err) {
      console.error(err);
      setError("Error fetching stores. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const submitRating = async (storeId, rating) => {
    if (!rating) return alert("Please select a rating before submitting.");
    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      await axios.post(
        `http://localhost:5000/api/stores/${storeId}/rate`,
        { rating },
        config
      );
      fetchStores();
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Failed to submit rating");
    }
  };

  const updateRating = async (storeId, rating) => {
    if (!rating) return alert("Please select a rating before updating.");
    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      await axios.patch(
        `http://localhost:5000/api/stores/${storeId}/rate`,
        { rating },
        config
      );
      fetchStores();
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Failed to update rating");
    }
  };

  const filteredStores = stores.filter(
    (s) =>
      s.name?.toLowerCase().includes(search.toLowerCase()) ||
      s.address?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div
      style={{
        minHeight: "100vh",
        fontFamily: "'Inter', sans-serif",
        background: "#f3f4f6",
        padding: "40px 20px",
      }}
    >
      <h1 style={{ textAlign: "center", color: "#6453c1", marginBottom: "40px" }}>
        Welcome, {user.name}!
      </h1>

      {/* Store Search */}
      <div style={{ textAlign: "center", marginBottom: "40px" }}>
        <input
          type="text"
          placeholder="Search by store name or address"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{
            width: "350px",
            padding: "12px 15px",
            borderRadius: "10px",
            border: "1px solid #d1d5db",
            outline: "none",
            boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
            transition: "all 0.2s",
          }}
        />
      </div>

      {/* Error & Loading */}
      {loading && <p style={{ textAlign: "center" }}>Loading stores...</p>}
      {error && <p style={{ textAlign: "center", color: "red" }}>{error}</p>}

      {/* Stores Grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
          gap: "25px",
        }}
      >
        {!loading && filteredStores.length === 0 ? (
          <p style={{ gridColumn: "1/-1", textAlign: "center", color: "#6b7280" }}>
            No stores found
          </p>
        ) : (
          filteredStores.map((store) => (
            <StoreCard
              key={store.id}
              store={store}
              onSubmitRating={submitRating}
              onUpdateRating={updateRating}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default UserDashboard;
