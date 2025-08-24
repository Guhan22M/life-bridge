const asyncHandler = require("express-async-handler");
const FirstAid = require("../models/firstAidModel");
require("dotenv").config();
const fetch = (...args) => import("node-fetch").then(({ default: fetch }) => fetch(...args));
const { GoogleGenerativeAI } = require("@google/generative-ai");

// ✅ Init Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const getMimeType = (url) => {
  if (url.endsWith(".png")) return "image/png";
  if (url.endsWith(".webp")) return "image/webp";
  if (url.endsWith(".gif")) return "image/gif";
  if (url.endsWith(".bmp")) return "image/bmp";
  return "image/jpeg";
};

// 🔹 Try flash first, then fallback to pro
async function generateWithFallback(parts) {
  const models = ["gemini-2.0-flash", "gemini-1.5-pro"];
  for (const m of models) {
    try {
      console.log(`⚡ Trying model: ${m}`);
      const model = genAI.getGenerativeModel({
        model: m,
        generationConfig: {
          temperature: 0.7,
          topK: 1,
          topP: 1,
          maxOutputTokens: 512, // keep low to avoid hitting quota
        },
      });

      const normalizedParts = Array.isArray(parts) ? parts : [{ text: String(parts) }];
      const result = await model.generateContent({
        contents: [{ role: "user", parts: normalizedParts }],
      });

      return result.response.text();
    } catch (err) {
      console.log(`❌ Model ${m} failed:`, err.message);
      if (err.message.includes("429") || err.message.includes("quota")) {
        continue; // try next model
      } else {
        throw err;
      }
    }
  }
  throw new Error("All models failed due to quota or errors.");
}

// @desc Generate first aid help using AI
// @route POST /api/first-aid
// @access Private
const generateFirstAid = asyncHandler(async (req, res) => {
  const { inputType, inputContent } = req.body;

  if (!inputType || !inputContent) {
    res.status(400);
    throw new Error("Please provide input type and content");
  }

  let resultText;

  if (inputType === "description") {
    console.log("it is entering description");
    const prompt = `A person is injured with this condition: ${inputContent}. What first aid steps should be followed?`;
    resultText = await generateWithFallback(prompt);

  } else if (inputType === "image") {
    console.log("it is entering image condition");
    const imageURL = inputContent;
    const imageBase64 = await fetch(imageURL)
      .then((res) => res.arrayBuffer())
      .then((buf) => Buffer.from(buf).toString("base64"));

    resultText = await generateWithFallback([
      {
        inlineData: {
          mimeType: getMimeType(imageURL),
          data: imageBase64,
        },
      },
      { text: "What first aid steps should be taken based on this image?" },
    ]);

  } else if (inputType === "both") {
    console.log("Working in both option");

    // FIX: Parse the inputContent object
    let image, description;
    try {
      // If inputContent is already an object (from frontend)
      if (typeof inputContent === "object" && inputContent !== null) {
        image = inputContent.image;
        description = inputContent.description;
      } else {
        // If it's a string (fallback), try to parse it
        const parsed = JSON.parse(inputContent);
        image = parsed.image;
        description = parsed.description;
      }
    } catch (error) {
      console.error("Error parsing inputContent:", error);
      res.status(400);
      throw new Error("Invalid inputContent format for 'both' type");
    }

    console.log("image is ", image);
    console.log("description is ", description);

    if (!image || !description) {
      res.status(400);
      throw new Error("Both image and description are required");
    }

    const imageBase64 = await fetch(image)
      .then((res) => res.arrayBuffer())
      .then((buf) => Buffer.from(buf).toString("base64"));

    console.log("base64 image processed");

    resultText = await generateWithFallback([
      {
        inlineData: {
          mimeType: getMimeType(image),
          data: imageBase64,
        },
      },
      {
        text: `This is the situation: ${description}. Based on this image and description, what first aid should be given?`,
      },
    ]);

    console.log("AI raw result:", resultText);

  } else {
    res.status(400);
    throw new Error("Invalid inputType");
  }

  // ✅ Save to DB
  const history = await FirstAid.create({
    user: req.user.id,
    inputType,
    inputContent,
    aiResponse: resultText,
  });

  res.status(200).json(history);
});

// @desc Get user's first aid history
// @route GET /api/first-aid/history
// @access Private
const getFirstAidHistory = asyncHandler(async (req, res) => {
  const history = await FirstAid.find({ user: req.user._id }).sort({ createdAt: -1 });
  res.status(200).json(history);
});

// @desc Delete specific first aid entry
// @route DELETE /api/first-aid/:id
// @access Private
const deleteFirstAidEntry = asyncHandler(async (req, res) => {
  const entry = await FirstAid.findById(req.params.id);

  if (!entry) {
    res.status(404);
    throw new Error("Entry not found");
  }

  if (entry.user.toString() !== req.user._id.toString()) {
    res.status(401);
    throw new Error("Not authorized");
  }

  await FirstAid.deleteOne({ _id: req.params.id });
  res.status(200).json({ message: "First aid entry deleted" });
});

module.exports = {
  generateFirstAid,
  getFirstAidHistory,
  deleteFirstAidEntry,
};
