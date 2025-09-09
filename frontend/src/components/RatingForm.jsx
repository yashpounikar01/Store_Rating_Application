import React, { useState } from "react";

const RatingForm = ({ currentRating = "", onSubmit }) => {
  const [rating, setRating] = useState(currentRating || 0);
  const [hoverRating, setHoverRating] = useState(0);
  

  const handleSubmit = (e) => {
    e.preventDefault();
    if (rating < 1 || rating > 5) {
      alert("Please select a rating between 1 and 5 stars.");
      return;
    }
    onSubmit({ rating});
  };

  return (
    <form
      onSubmit={handleSubmit}
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "10px",
      }}
    >
      {/* Star Rating */}
      <div style={{ display: "flex", gap: "5px", fontSize: "24px", cursor: "pointer" }}>
        {[1, 2, 3, 4, 5].map((star) => (
          <span
            key={star}
            onClick={() => setRating(star)}
            onMouseEnter={() => setHoverRating(star)}
            onMouseLeave={() => setHoverRating(0)}
            style={{
              color: star <= (hoverRating || rating) ? "#f97316" : "#d1d5db",
              transition: "color 0.2s",
            }}
          >
            ★
          </span>
        ))}
      </div>


      {/* Submit Button */}
      <button
        type="submit"
        style={{
          padding: "10px 15px",
          backgroundColor: "#6453c1",
          color: "#fff",
          fontWeight: 600,
          border: "none",
          borderRadius: "8px",
          cursor: "pointer",
          transition: "all 0.2s",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = "#5140a6";
          e.currentTarget.style.transform = "scale(1.02)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = "#6453c1";
          e.currentTarget.style.transform = "scale(1)";
        }}
      >
        Submit
      </button>
    </form>
  );
};

export default RatingForm;
