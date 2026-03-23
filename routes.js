import express from "express";
import openaiClient from "./utils.js";

const router = express.Router();

router.get("/", (req, res) => {
  res.send("API is running");
});

router.post("/generate", async (req, res) => {
  try {
    const { prompt } = req.body;

    const response = await openaiClient.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }]
    });

    res.json({
      result: response.choices[0].message.content
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Something went wrong" });
  }
});

export default router;