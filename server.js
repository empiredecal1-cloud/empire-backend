import express from "express";
import cors from "cors";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Empire backend is running");
});

app.post("/chat", (req, res) => {
  const userMessage = req.body.message;

  console.log("User:", userMessage);

  res.json({
    reply: "Got your message: " + userMessage
  });
});

const PORT = process.env.PORT || 10000;

app.listen(PORT, () => {
  console.log("Server running on port", PORT);
});