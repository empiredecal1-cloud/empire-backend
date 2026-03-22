import express from "express";
import nodemailer from "nodemailer";
import openaiClient from "./utils.js";

const router = express.Router();

// TEMP ORDER STORAGE
let currentOrder = {};

// EMAIL SETUP
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "Empiredecal1@gmail.com",
    pass: "PASTE_YOUR_APP_PASSWORD_HERE",
  },
});

// SEND EMAIL
async function sendLeadEmail(order) {
  try {
    await transporter.sendMail({
      from: "Empiredecal1@gmail.com",
      to: "Empiredecal1@gmail.com",
      subject: "🔥 New Empire Decal Lead",
      text: `
New Order:

Name: ${order.name || ""}
Phone: ${order.phone || ""}
Type: ${order.orderType || ""}

Item: ${order.itemType || ""}
Quantity: ${order.quantity || ""}
Sizes: ${order.sizes || ""}
Color: ${order.color || ""}
Grade: ${order.grade || ""}
Print Type: ${order.printType || ""}
Placement: ${order.logoPlacement || ""}
Design Size: ${order.designSize || ""}

Decal Size: ${order.decalSize || ""}
Logo File: ${order.logoFile || ""}
      `,
    });

    console.log("✅ Email sent");
  } catch (err) {
    console.log("❌ Email failed:", err);
  }
}

// AI SYSTEM PROMPT
const SYSTEM_PROMPT = `
You are an order assistant for Empire Decal.

Return ONLY JSON in this format:

{
  "reply": "message to user",
  "order": {
    "name": "",
    "phone": "",
    "orderType": "",
    "itemType": "",
    "quantity": "",
    "sizes": "",
    "color": "",
    "grade": "",
    "printType": "",
    "logoPlacement": "",
    "designSize": "",
    "logoFile": "",
    "decalSize": ""
  },
  "complete": false
}

Rules:
- Ask ONLY for missing fields
- Ask ONE question at a time
- Do NOT repeat questions
- Fill fields only if user provides them
- Set complete=true ONLY when all required fields are collected
- When complete=true say: "We’ll get a quote over to you shortly."
`;

router.post("/chat", async (req, res) => {
  const { message } = req.body;

  try {
    const response = await openaiClient.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: message },
      ],
    });

    let aiData;

    try {
      aiData = JSON.parse(response.choices[0].message.content);
    } catch {
      return res.json({ reply: "Error reading AI response." });
    }

    // MERGE ORDER DATA
    currentOrder = {
      ...currentOrder,
      ...aiData.order,
    };

    // SEND EMAIL IF COMPLETE
    if (aiData.complete) {
      await sendLeadEmail(currentOrder);
      console.log("🔥 LEAD CAPTURED:", currentOrder);
      currentOrder = {};
    }

    res.json({ reply: aiData.reply });

  } catch (error) {
    console.log("❌ Chat error:", error);
    res.json({ reply: "Something went wrong." });
  }
});

export default router;