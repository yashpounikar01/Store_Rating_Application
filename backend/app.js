const express = require("express");
const cors = require("cors");
const authRoutes = require("./routes/authRoutes");
const storeRoutes = require("./routes/storeRoutes");
const adminRoutes = require("./routes/adminRoutes");

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/stores", storeRoutes);
app.use("/api/admin", adminRoutes);

app.listen(5000, "0.0.0.0", () => {
  console.log("Server running on port 5000");
});

