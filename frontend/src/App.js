import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import UserDashboard from "./pages/UserDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import StoreOwnerDashboard from "./pages/StoreOwnerDashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import HomePage from "./pages/HomePage"; 

import Footer from "./components/Footer"; 

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* User Dashboard */}
        <Route
          path="/user/dashboard"
          element={
            <ProtectedRoute role="user">
              <UserDashboard />
            </ProtectedRoute>
          }
        />

        {/* Admin Dashboard */}
        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute role="admin">
              <AdminDashboard />
            </ProtectedRoute>
          }
        />

        {/* Store Owner Dashboard */}
        <Route
          path="/store/dashboard"
          element={
            <ProtectedRoute role="store_owner">
              <StoreOwnerDashboard />
            </ProtectedRoute>
          }
        />

        {/* Fallback */}
        <Route path="*" element={<h2>Page Not Found</h2>} />
      </Routes>

      {/* Footer rendered on all pages */}
      <Footer />
    </Router>
  );
}


export default App;
