import express from "express";
import * as dotenv from "dotenv";
import Bytez from "bytez.js";

dotenv.config();

const router = express.Router();

// Initialize Bytez SDK
const sdk = new Bytez(process.env.AI_API_KEY);

// Load DALL-E 3 model
const model = sdk.model("openai/dall-e-3");

// Test Route
router.get("/", (req, res) => {
  res.send("Bytez DALL-E route working");
});

router.post("/", async (req, res) => {
  try {
    const { prompt } = req.body;
    console.log("➡️ Received prompt:", prompt);

    const { error, output } = await model.run(prompt);

    if (error) {
      console.log("❌ Bytez API Error:", error);
      return res.status(500).json({ error });
    }

    if (!output || typeof output !== "string") {
      console.log("❌ No image URL returned");
      return res.status(500).json({ error: "No image URL returned" });
    }

    // 🔒 Ensure HTTPS to prevent mixed-content errors
    const secureUrl = output.startsWith("http://")
      ? output.replace("http://", "https://")
      : output;

    console.log("IMAGE URL:", secureUrl);

    return res.status(200).json({ photo: secureUrl });

  } catch (err) {
    console.log("❌ SERVER ERROR:", err);
    res.status(500).json({ error: err.message });
  }
});

export default router;
