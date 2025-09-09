import React, { useState } from "react";
import RatingForm from "./RatingForm";

const StoreCard = ({ store, onSubmitRating, onUpdateRating }) => {
  const [showForm, setShowForm] = useState(false);

  // Receive object { rating, comment } from RatingForm
  const handleSubmit = ({ rating }) => {
  if (store.userRating) onUpdateRating(store.id, rating); // Pass number directly
  else onSubmitRating(store.id, rating);                // Pass number directly
  setShowForm(false);
};


  return (
    <div
      style={{
        background: "#fff",
        borderRadius: "15px",
        padding: "20px",
        boxShadow: "0 6px 15px rgba(0,0,0,0.1)",
        transition: "transform 0.2s, box-shadow 0.2s",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "translateY(-5px)";
        e.currentTarget.style.boxShadow = "0 12px 25px rgba(0,0,0,0.15)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "translateY(0)";
        e.currentTarget.style.boxShadow = "0 6px 15px rgba(0,0,0,0.1)";
      }}
    >
      <h3 style={{ color: "#6453c1", marginBottom: "8px" }}>{store.name}</h3>
      <p style={{ color: "#374151", marginBottom: "8px" }}>{store.address}</p>
      <p style={{ marginBottom: "5px", fontWeight: 500 }}>
        Overall Rating: <span style={{ color: "#f97316" }}>{store.avgRating || "N/A"}</span>
      </p>
      <p style={{ marginBottom: "15px", fontWeight: 500 }}>
        Your Rating: <span style={{ color: "#f97316" }}>{store.userRating || "N/A"}</span>
      </p>

      {!showForm && (
        <button
          onClick={() => setShowForm(true)}
          style={{
            padding: "10px 18px",
            backgroundColor: store.userRating ? "#10b981" : "#f97316",
            color: "#fff",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
            fontWeight: 600,
            transition: "all 0.2s",
          }}
          onMouseEnter={(e) =>
            (e.currentTarget.style.backgroundColor = store.userRating ? "#059669" : "#ea580c")
          }
          onMouseLeave={(e) =>
            (e.currentTarget.style.backgroundColor = store.userRating ? "#10b981" : "#f97316")
          }
        >
          {store.userRating ? "Update Rating" : "Submit Rating"}
        </button>
      )}

      {showForm && (
        <div style={{ marginTop: "15px" }}>
          <RatingForm
            currentRating={store.userRating}
            
            onSubmit={handleSubmit}
          />
          <button
            onClick={() => setShowForm(false)}
            style={{
              marginTop: "10px",
              padding: "8px 15px",
              backgroundColor: "#9ca3af",
              color: "#fff",
              border: "none",
              borderRadius: "8px",
              cursor: "pointer",
              fontWeight: 500,
              transition: "all 0.2s",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#6b7280")}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#9ca3af")}
          >
            Cancel
          </button>
        </div>
      )}
    </div>
  );
};

export default StoreCard;
