import express from "express";
import { generateResponse, sendEmail } from "./utils.js";

const router = express.Router();

// test route
router.get("/", (req, res) => {
  res.send("API is working");
});

// main route
router.post("/chat", async (req, res) => {
  try {
    const { message } = req.body;

    const aiResponse = await generateResponse(message);

    await sendEmail(aiResponse);

    res.json({ reply: aiResponse });
  } catch (error) {
    console.error("ERROR:", error);
    res.status(500).send("Something broke");
  }
});

export default router;