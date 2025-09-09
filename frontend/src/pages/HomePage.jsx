import React from "react";
import { Link } from "react-router-dom";
import storeImg from './StoreIMG.jpg';

const HomePage = () => {
  return (
    <div style={{ fontFamily: "'Inter', sans-serif" }}>
      {/* Hero Section */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "80px 100px",
          minHeight: "100vh",
          background: "linear-gradient(135deg, #4f46e5 0%, #6366f1 100%)",
          color: "white",
          gap: "50px",
          flexWrap: "wrap",
        }}
      >
        {/* Text */}
        <div style={{ flex: 1, minWidth: "300px" }}>
          <h1 style={{ fontSize: "3.5rem", fontWeight: 700, marginBottom: "20px", lineHeight: 1.2 }}>
            Discover & Rate the Best Stores Near You
          </h1>
          <p style={{ fontSize: "1.25rem", marginBottom: "40px", color: "#e0e7ff" }}>
            Join our community and share your shopping experience. Find top-rated stores instantly.
          </p>
          <div>
            <Link
              to="/signup"
              style={{
                padding: "15px 30px",
                marginRight: "15px",
                fontSize: "1rem",
                fontWeight: 600,
                borderRadius: "10px",
                textDecoration: "none",
                backgroundColor: "white",
                color: "#4f46e5",
                transition: "all 0.3s ease",
              }}
              onMouseEnter={(e) => (e.target.style.transform = "translateY(-3px)")}
              onMouseLeave={(e) => (e.target.style.transform = "translateY(0)")}
            >
              Get Started
            </Link>
            <Link
              to="/login"
              style={{
                padding: "15px 30px",
                marginRight: "15px",
                fontSize: "1rem",
                fontWeight: 600,
                borderRadius: "10px",
                textDecoration: "none",
                border: "2px solid white",
                color: "white",
                transition: "all 0.3s ease",
              }}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = "white";
                e.target.style.color = "#4f46e5";
                e.target.style.transform = "translateY(-3px)";
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = "transparent";
                e.target.style.color = "white";
                e.target.style.transform = "translateY(0)";
              }}
            >
              Login
            </Link>
          </div>
        </div>

        {/* Hero Image */}
       <div style={{ flex: 1, minWidth: 300, textAlign: "center" }}>
  <img
    src={storeImg}
    alt="Store"
    style={{
      width: "100%",
      maxWidth: 500,
      borderRadius: 20,
      boxShadow: "0 20px 40px rgba(0, 0, 0, 0.2)",
    }}
  />
</div>

      </div>

      {/* Features Section */}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          gap: "30px",
          padding: "80px 50px",
          background: "#f8fafc",
          flexWrap: "wrap",
        }}
      >
        {[
          {
            title: "Easy Ratings",
            desc: "Rate stores quickly with a simple interface and share your experience.",
          },
          {
            title: "Track Popular Stores",
            desc: "See which stores are loved by the community and make informed choices.",
          },
          {
            title: "Secure & Reliable",
            desc: "Your data is safe and authentication is secure. Trust our platform.",
          },
        ].map((feature, idx) => (
          <div
            key={idx}
            style={{
              background: "white",
              padding: "30px 20px",
              borderRadius: "20px",
              boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
              flex: "1",
              maxWidth: "300px",
              textAlign: "center",
              transition: "transform 0.3s ease, box-shadow 0.3s ease",
              marginBottom: "20px",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-10px)";
              e.currentTarget.style.boxShadow = "0 20px 40px rgba(0,0,0,0.15)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = "0 10px 30px rgba(0,0,0,0.1)";
            }}
          >
            <h3 style={{ marginBottom: "15px", color: "#111827" }}>{feature.title}</h3>
            <p style={{ color: "#6b7280", fontSize: "0.95rem" }}>{feature.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HomePage;
