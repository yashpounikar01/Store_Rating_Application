import React, { useState, useEffect } from "react";

const Footer = () => {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Show footer if user scrolls at all
      if (window.scrollY > 50) {
        setShow(true);
      } else {
        setShow(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <footer
      style={{
        ...footerStyle,
        opacity: show ? 1 : 0,
        transition: "opacity 0.5s ease",
      }}
    >
      <p>© {new Date().getFullYear()} Store Ratings. Designed and Developed By Yash Pounikar.</p>
    </footer>
  );
};

const footerStyle = {
  position: "fixed",
  bottom: 0,
  left: 0,
  width: "100%",
  padding: "15px 50px",
  textAlign: "center",
  backgroundColor: "#f9fafb",
  borderTop: "1px solid #e5e7eb",
  fontFamily: "'Inter', sans-serif",
  color: "#6b7280",
  zIndex: 1000,
};

export default Footer;
