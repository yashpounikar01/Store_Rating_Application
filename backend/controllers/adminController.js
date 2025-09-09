const db = require("../config/db");
const bcrypt = require("bcryptjs");

// -------------------- DASHBOARD STATS --------------------
exports.getDashboardStats = async (req, res) => {
  try {
    const [[users]] = await db.execute("SELECT COUNT(*) AS totalUsers FROM users");
    const [[stores]] = await db.execute("SELECT COUNT(*) AS totalStores FROM stores");
    const [[ratings]] = await db.execute("SELECT COUNT(*) AS totalRatings FROM ratings");

    const data = {
      totalUsers: users.totalUsers,
      totalStores: stores.totalStores,
      totalRatings: ratings.totalRatings,
    };

    console.log("Stats API response:", data); 
    res.json(data);
  } catch (err) {
    console.error("Error in getDashboardStats:", err);
    res.status(500).json({ message: err.message });
  }
};


// -------------------- GET USERS WITH FILTERS --------------------
exports.getUsers = async (req, res) => {
  try {
    const { name, email, role, address } = req.query;
    let query = "SELECT id, name, email, address, role FROM users WHERE 1=1";
    const params = [];

    if (name) { query += " AND name LIKE ?"; params.push(`%${name}%`); }
    if (email) { query += " AND email LIKE ?"; params.push(`%${email}%`); }
    if (role) { query += " AND role = ?"; params.push(role); }
    if (address) { query += " AND address LIKE ?"; params.push(`%${address}%`); }

    const [users] = await db.execute(query, params);
    res.json(users);
  } catch (err) {
    console.error("Error in getUsers:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// -------------------- ADD NEW USER --------------------
exports.addUser = async (req, res) => {
  try {
    const { name, email, password, address, role } = req.body;

    if (!["user", "admin", "store_owner"].includes(role)) {
      return res.status(400).json({ message: "Invalid role" });
    }

    const [existing] = await db.execute("SELECT * FROM users WHERE email=?", [email]);
    if (existing.length) return res.status(400).json({ message: "Email already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);
    await db.execute(
      "INSERT INTO users (name, email, password, address, role) VALUES (?, ?, ?, ?, ?)",
      [name, email, hashedPassword, address, role]
    );

    res.json({ message: "User added successfully" });
  } catch (err) {
    console.error("Error in addUser:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// -------------------- GET STORES WITH AVG RATING --------------------
exports.getStores = async (req, res) => {
  try {
    const { name, address } = req.query;

    let query = `
      SELECT s.id, s.name, s.email, s.address, u.name AS owner_name,
        IFNULL((SELECT AVG(r.rating) FROM ratings r WHERE r.store_id = s.id), 0) AS avgRating
      FROM stores s
      LEFT JOIN users u ON s.owner_id = u.id
      WHERE 1=1
    `;
    const params = [];

    if (name) { query += " AND s.name LIKE ?"; params.push(`%${name}%`); }
    if (address) { query += " AND s.address LIKE ?"; params.push(`%${address}%`); }

    query += " ORDER BY s.id";

    const [stores] = await db.execute(query, params);
    res.json(stores);
  } catch (err) {
    console.error("Error in getStores:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// -------------------- ADD NEW STORE --------------------
exports.addStore = async (req, res) => {
  try {
    const { name, email, address, owner_id } = req.body;

    await db.execute(
      "INSERT INTO stores (name, email, address, owner_id) VALUES (?, ?, ?, ?)",
      [name, email, address, owner_id || null]
    );

    res.json({ message: "Store added successfully" });
  } catch (err) {
    console.error("Error in addStore:", err);
    res.status(500).json({ message: "Server error" });
  }
};
