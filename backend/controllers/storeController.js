const db = require("../config/db");

// Get all stores with avg rating and user's rating
exports.getStores = async (req, res) => {
  try {
    const [stores] = await db.execute(
      `
      SELECT s.id, s.name, s.address,
        (SELECT AVG(r.rating) FROM ratings r WHERE r.store_id = s.id) AS avgRating,
        (SELECT r.rating FROM ratings r WHERE r.store_id = s.id AND r.user_id = ?) AS userRating
      FROM stores s
      `,
      [req.user.id]
    );

    res.json(stores);
  } catch (err) {
    console.error("Error in getStores:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// Submit a new rating
exports.submitRating = async (req, res) => {
  const userId = req.user.id;
  const { storeId } = req.params;
  const { rating } = req.body;

  try {
    const [existing] = await db.execute(
      "SELECT * FROM ratings WHERE user_id = ? AND store_id = ?",
      [userId, storeId]
    );

    if (existing.length > 0) {
      return res.status(400).json({ message: "Rating already exists. Use update." });
    }

    await db.execute(
      "INSERT INTO ratings (user_id, store_id, rating) VALUES (?, ?, ?)",
      [userId, storeId, rating]
    );

    res.json({ message: "Rating submitted successfully" });
  } catch (err) {
    console.error("Error in submitRating:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// Update an existing rating
exports.updateRating = async (req, res) => {
  const userId = req.user.id;
  const { storeId } = req.params;
  const { rating } = req.body;

  try {
    const [existing] = await db.execute(
      "SELECT * FROM ratings WHERE user_id = ? AND store_id = ?",
      [userId, storeId]
    );

    if (existing.length === 0) {
      return res.status(400).json({ message: "Rating does not exist. Use submit." });
    }

    await db.execute(
      "UPDATE ratings SET rating = ? WHERE user_id = ? AND store_id = ?",
      [rating, userId, storeId]
    );

    res.json({ message: "Rating updated successfully" });
  } catch (err) {
    console.error("Error in updateRating:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// Store owner dashboard
exports.getStoreDashboard = async (req, res) => {
  try {
    const storeOwnerId = req.user.id;

    // Find the store owned by this user
    const [[store]] = await db.execute(
      "SELECT id FROM stores WHERE owner_id = ?",
      [storeOwnerId]
    );

    if (!store) return res.status(404).json({ message: "Store not found for owner" });

    // Get ratings for this store
    const [raters] = await db.execute(
      `SELECT u.name AS userName, u.email AS userEmail, r.rating, r.comment
       FROM ratings r
       JOIN users u ON r.user_id = u.id
       WHERE r.store_id = ?`,
      [store.id]
    );

    // Get average rating
    const [[avg]] = await db.execute(
      "SELECT AVG(rating) AS avgRating FROM ratings WHERE store_id = ?",
      [store.id]
    );

    res.json({
      averageRating: avg.avgRating || 0,
      totalRaters: raters.length,
      raters,
    });
  } catch (err) {
    console.error("Error in getStoreDashboard:", err);
    res.status(500).json({ message: "Server error" });
  }
};



exports.getMyStore = async (req, res) => {
  try {
    const storeOwnerId = req.user.id;

    // Find the store assigned to this store owner
    const [[store]] = await db.execute(
      "SELECT id, name, address FROM stores WHERE owner_id = ?",
      [storeOwnerId]
    );

    if (!store) {
      return res.status(404).json({ message: "Store not found for this owner" });
    }

    res.json({
      id: store.id,
      name: store.name,
      address: store.address,
    });
  } catch (err) {
    console.error("Error in getMyStore:", err);
    res.status(500).json({ message: "Server error" });
  }
};

