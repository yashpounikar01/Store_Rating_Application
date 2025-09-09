const express = require("express");
const router = express.Router();
const {
  getStores,
  submitRating,
  updateRating,
  getStoreDashboard,
  getMyStore, 
} = require("../controllers/storeController");
const { authMiddleware } = require("../middleware/authMiddleware");

// Routes for users
router.get("/", authMiddleware, getStores);               // Get all stores with avg + user rating
router.post("/:storeId/rate", authMiddleware, submitRating); // Submit new rating
router.patch("/:storeId/rate", authMiddleware, updateRating); // Update existing rating

// Routes for store owner
router.get("/dashboard", authMiddleware, getStoreDashboard);
router.get("/my-store", authMiddleware, getMyStore); 

module.exports = router;
