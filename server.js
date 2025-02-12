const express = require("express");
const multer = require("multer");
const pdf = require("pdf-parse");
const axios = require("axios");
const cors = require("cors");
require("dotenv").config();

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

const upload = multer({ dest: "uploads/" });

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

// Extract text from a PDF
async function extractTextFromPDF(pdfPath) {
    const dataBuffer = require("fs").readFileSync(pdfPath);
    const data = await pdf(dataBuffer);
    return data.text; // Extracted text from the PDF
}

// Process text with Gemini
async function processWithGemini(text) {
    const url = `https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateText?key=${GEMINI_API_KEY}`;

    const payload = {
        prompt: {
            text: `Summarize the following document:\n\n${text.substring(0, 4000)}` // Trim for token limits
        }
    };

    try {
        const response = await axios.post(url, payload, {
            headers: { "Content-Type": "application/json" }
        });

        return response.data.candidates[0].output;
    } catch (error) {
        console.error("Error processing with Gemini:", error.response?.data || error.message);
        return "Error processing with AI.";
    }
}

// Upload PDF endpoint
app.post("/upload", upload.single("pdf"), async (req, res) => {
    if (!req.file) return res.status(400).send("No file uploaded.");

    try {
        const extractedText = await extractTextFromPDF(req.file.path);
        const summary = await processWithGemini(extractedText);
        res.json({ extractedText, summary });
    } catch (err) {
        res.status(500).send("Error processing PDF.");
    }
});

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
