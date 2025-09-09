const db = require("../config/db");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// ---------------- Signup ----------------
exports.signup = async (req, res) => {
  const { name, email, password, address } = req.body;

  try {
    const [existing] = await db.execute("SELECT * FROM users WHERE email=?", [email]);
    if (existing.length) return res.status(400).json({ message: "Email already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);
    await db.execute(
      "INSERT INTO users (name,email,password,address,role) VALUES (?,?,?,?,?)",
      [name, email, hashedPassword, address, "user"]
    );

    res.json({ message: "Signup successful" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// ---------------- Login ----------------
exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const [users] = await db.execute("SELECT * FROM users WHERE email=?", [email]);
    if (!users.length) return res.status(400).json({ message: "Invalid credentials" });

    const user = users[0];
    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET || "your_jwt_secret",
      { expiresIn: "1d" }
    );

    res.json({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      token,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// ---------------- Update Password ----------------

exports.updatePassword = async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;
    const userId = req.user.id;

    const [rows] = await db.query("SELECT password FROM users WHERE id = ?", [userId]);
    if (!rows.length) return res.status(404).json({ message: "User not found" });

    const isMatch = await bcrypt.compare(oldPassword, rows[0].password);
    if (!isMatch) return res.status(400).json({ message: "Invalid old password" });

    // Optional: Password validation regex
    const regex = /^(?=.*[A-Z])(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,16}$/;
    if (!regex.test(newPassword)) {
      return res.status(400).json({
        message: "Password must be 8–16 chars, include an uppercase letter and a special char.",
      });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await db.query("UPDATE users SET password = ? WHERE id = ?", [hashedPassword, userId]);

    res.json({ message: "Password updated successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const { name, email, address } = req.body;

    // Fetch current user data
    const [[currentUser]] = await db.execute("SELECT name, email, address FROM users WHERE id = ?", [userId]);
    if (!currentUser) return res.status(404).json({ message: "User not found" });

    // Compare old vs new values
    console.log("Profile update request for user ID:", userId);
    if (name !== currentUser.name) console.log(`Name updated: ${currentUser.name} -> ${name}`);
    if (email !== currentUser.email) console.log(`Email updated: ${currentUser.email} -> ${email}`);
    if (address !== currentUser.address) console.log(`Address updated: ${currentUser.address} -> ${address}`);

    // Update user in DB
    await db.execute(
      "UPDATE users SET name = ?, email = ?, address = ? WHERE id = ?",
      [name, email, address, userId]
    );

    res.json({ message: "Profile updated successfully" });
  } catch (err) {
    console.error("Error in updateProfile:", err);
    res.status(500).json({ message: "Server error" });
  }
};
