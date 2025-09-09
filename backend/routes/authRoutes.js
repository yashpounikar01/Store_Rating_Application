// authRoutes.js
const express = require("express");
const router = express.Router();
const { signup, login, updatePassword , updateProfile} = require("../controllers/authController");
const { authMiddleware } = require("../middleware/authMiddleware"); 

router.post("/signup", signup);
router.post("/login", login);
router.patch("/password", authMiddleware, updatePassword);
router.put("/update", authMiddleware, updateProfile);

module.exports = router;
