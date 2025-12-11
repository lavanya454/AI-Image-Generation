
// import express from "express";
// import * as dotenv from "dotenv";

// dotenv.config();

// const router = express.Router();

// // Test route
// router.get("/", (req, res) => {
//   res.send("HF image route working");
// });

// router.post("/", async (req, res) => {
//   try {
//     const { prompt } = req.body;
//     console.log("➡️ Received prompt:", prompt);

//     const response = await fetch("https://router.huggingface.co/nscale/v1/images/generations", {
//       method: "POST",
//       headers: {
//         Authorization: `Bearer ${process.env.HF_API_KEY}`,
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify({
//         model: "stabilityai/stable-diffusion-xl-base-1.0", // ✅ Router-supported model
//         prompt: prompt,
//         size: "1024x1024",
//         response_format: "b64_json",
//       }),
//     });

//     const text = await response.text();

//     if (!response.ok) {
//       console.log("❌ HF API ERROR:", text);
//       return res.status(500).json({ error: text });
//     }

//     const result = JSON.parse(text);
//     const image = result.data[0].b64_json;

//     return res.status(200).json({ photo: image });

//   } catch (err) {
//     console.log("❌ SERVER ERROR:", err);
//     res.status(500).json({ error: err.message });
//   }
// });

// export default router;

/*
  npm i bytez.js
*/
/*
  npm install bytez.js
*/

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

    // output is a DIRECT IMAGE URL
    if (!output || typeof output !== "string") {
      console.log("❌ No image URL returned");
      return res.status(500).json({ error: "No image URL returned" });
    }

    console.log("IMAGE URL:", output);

    return res.status(200).json({ photo: output });

  } catch (err) {
    console.log("❌ SERVER ERROR:", err);
    res.status(500).json({ error: err.message });
  }
});


export default router;
