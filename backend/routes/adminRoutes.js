const express = require("express");
const router = express.Router();
const {
  getDashboardStats,
  getUsers,
  addUser,
  getStores,
  addStore
} = require("../controllers/adminController");

const { authMiddleware, adminOnly } = require("../middleware/authMiddleware");

// -------------------- STATS --------------------
// GET /api/admin/stats
router.get("/stats", authMiddleware, adminOnly, getDashboardStats);

// -------------------- USERS --------------------
// GET /api/admin/users?name=&email=&role=&address=
router.get("/users", authMiddleware, adminOnly, getUsers);

// POST /api/admin/users
router.post("/users", authMiddleware, adminOnly, addUser);

// -------------------- STORES --------------------
// GET /api/admin/stores?name=&address=
router.get("/stores", authMiddleware, adminOnly, getStores);

// POST /api/admin/stores
router.post("/stores", authMiddleware, adminOnly, addStore);

module.exports = router;
