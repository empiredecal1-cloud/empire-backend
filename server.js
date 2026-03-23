// server.js

const express = require("express");
const app = express();

// Middleware
app.use(express.json());

// Root route (important so your URL shows something)
app.get("/", (req, res) => {
  res.send("✅ Server is running!");
});

// Example API route
app.get("/api", (req, res) => {
  res.json({ message: "Hello from backend 🚀" });
});

// Use dynamic port (REQUIRED for Render)
const PORT = process.env.PORT || 10000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});