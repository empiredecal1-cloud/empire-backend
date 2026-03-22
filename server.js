import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import chatRoute from "./routes.js"; // ✅ FIXED (points to your actual file)

dotenv.config();

const app = express();

// ✅ CORS (allow everything for now)
app.use(cors({
  origin: "*"
}));

app.use(express.json());

// ✅ ROUTES
app.use("/chat", chatRoute);

// ✅ TEST ROUTE
app.get("/", (req, res) => {
  res.send("Server is running");
});

// ✅ IMPORTANT FOR RENDER
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});