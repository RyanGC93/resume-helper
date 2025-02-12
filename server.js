const express = require("express");
const multer = require("multer");
const axios = require("axios");
const cors = require("cors");
require("dotenv").config();
const fs = require("fs");
const { GoogleGenerativeAI } = require("@google/generative-ai");
const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

const upload = multer({ dest: "uploads/" });

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

// Process PDF using Gemini
async function processWithGemini(pdfBuffer) {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  
    const model = genAI.getGenerativeModel({ model: 'models/gemini-1.5-flash' });
    const base64PDF = pdfBuffer.toString('base64'); // <-- This is the critical change

    const request = {
      contents: [{
        parts: [
          {
            inlineData: {
              data: base64PDF, // Use the base64 encoded string
              mimeType: "application/pdf"
            }
          },
          {
            text: 'Please analyze the following resume and extract key details, including the candidates skills, experience, education, certifications, and any notable achievements. Identify the strongest areas of the resume and any potential gaps or areas for improvement. Based on this, provide a summary of the candidate’s qualifications and suggest possible roles or industries where their skills would be most applicable '
          }
        ]
      }]
    };
  
    try {
      const result = await model.generateContent(request);
  
      // Check if the response and candidates exist before accessing properties
      if (result && result.response && result.response.candidates && result.response.candidates[0] && result.response.candidates[0].content && result.response.candidates[0].content.parts && result.response.candidates[0].content.parts[0] && result.response.candidates[0].content.parts[0].text) {
        const summary = result.response.candidates[0].content.parts[0].text;
        console.log(summary);
        return summary;
      } else {
        console.error("Unexpected response structure:", JSON.stringify(result, null, 2));
        return "Error processing with AI: Unexpected response structure.";
      }
  
  
    } catch (error) {
      console.error("Error processing with Gemini:", error.response?.data || error.message || error); // Include error object itself.
      return "Error processing with AI: " + (error.message || "Unknown Error"); // More informative error message
    }
  }
// Upload PDF endpoint
app.post("/upload", upload.single("pdf"), async (req, res) => {
    if (!req.file) return res.status(400).send("No file uploaded.");

    try {
        const pdfBuffer = fs.readFileSync(req.file.path);
        const summary = await processWithGemini(pdfBuffer);
        res.json({ summary });
    } catch (err) {
        res.status(500).send("Error processing PDF.");
    }
});

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
