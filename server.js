const express = require("express");
const multer = require("multer");
const cors = require("cors");
require("dotenv").config();
const fs = require("fs");
const admin = require("firebase-admin");
const { Storage } = require("@google-cloud/storage");
const { GoogleGenerativeAI } = require("@google/generative-ai");

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

const upload = multer({ dest: "uploads/" });

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const BUCKET_NAME = process.env.GCS_BUCKET_NAME; // Ensure this is set in .env
const storage = new Storage();

// Function to upload file to Google Cloud Storage
async function uploadToGCS(filePath, fileName) {
    return new Promise((resolve, reject) => {
        const bucket = storage.bucket(BUCKET_NAME);
        const file = bucket.file(fileName);

        fs.createReadStream(filePath)
            .pipe(file.createWriteStream({
                resumable: false,
                contentType: "application/pdf",
            }))
            .on("finish", () => resolve(`gs://${BUCKET_NAME}/${fileName}`))
            .on("error", (err) => console.log(err));
    });
}

async function authenticateUser(req, res, next) {
  const token = req.headers.authorization?.split("Bearer ")[1];
  if (!token) return res.status(401).send("Unauthorized");

  try {
      const decodedToken = await admin.auth().verifyIdToken(token);
      req.user = decodedToken;
      next();
  } catch (error) {
      res.status(403).send("Invalid token");
  }
}

// Get signed URL for user's file
app.get("/get-pdf/:fileName", authenticateUser, async (req, res) => {
  const userId = req.user.uid; // Get user ID from Firebase token
  const fileName = req.params.fileName;
  const filePath = `users/${userId}/${fileName}`; // User-specific storage path

  try {
      const options = {
          version: "v4",
          action: "read",
          expires: Date.now() + 15 * 60 * 1000, // 15 minutes expiration
      };

      const [url] = await storage.bucket(BUCKET_NAME).file(filePath).getSignedUrl(options);
      res.json({ url });
  } catch (error) {
      console.error("Error generating signed URL:", error);
      res.status(500).send("Failed to get signed URL.");
  }
});


// Route to get the list of PDFs
app.get("/pdfs", async (req, res) => {
  try {
      const [files] = await storage.bucket(BUCKET_NAME).getFiles();
      const pdfFiles = files
          .filter(file => file.name.endsWith(".pdf"))
          .map(file => ({
              name: file.name,
              url: `https://storage.googleapis.com/${BUCKET_NAME}/${file.name}`,
          }));

      res.json(pdfFiles);
  } catch (error) {
      console.error("Error fetching PDFs:", error);
      res.status(500).send("Error retrieving PDFs.");
  }
});


// Process PDF using Gemini
async function processWithGemini(pdfBuffer) {
    const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "models/gemini-1.5-flash" });
    const base64PDF = pdfBuffer.toString("base64");

    const request = {
        contents: [{
            parts: [
                {
                    inlineData: {
                        data: base64PDF,
                        mimeType: "application/pdf",
                    },
                },
                {
                    text: "Please analyze the following resume and extract key details, including the candidate’s skills, experience, education, certifications, and any notable achievements. Identify the strongest areas of the resume and any potential gaps or areas for improvement. Based on this, provide a summary of the candidate’s qualifications and suggest possible roles or industries where their skills would be most applicable.",
                },
            ],
        }],
    };

    try {
        const result = await model.generateContent(request);
        const summary = result?.response?.candidates?.[0]?.content?.parts?.[0]?.text;
        return summary || "Error: Unexpected response structure.";
    } catch (error) {
        console.error("Error processing with Gemini:", error.message);
        return "Error processing with AI.";
    }
}

// Upload PDF endpoint
app.post("/upload", authenticateUser, upload.single("pdf"), async (req, res) => {
  const userId = req.user.uid;
  const fileName = `users/${userId}/${req.file.originalname}`;

  try {
      const gcsUri = await uploadToGCS(req.file.path, fileName);
      res.json({ gcsUri });
              const pdfBuffer = fs.readFileSync(req.file.path);
        const summary = await processWithGemini(pdfBuffer);
  } catch (err) {
      console.error("Upload error:", err);
      res.status(500).send("Error uploading file.");
  }
});

// app.post("/upload", upload.single("pdf"), async (req, res) => {
//     if (!req.file) return res.status(400).send("No file uploaded.");

//     try {
//         const gcsUri = await uploadToGCS(req.file.path, req.file.originalname);
//         console.log(`File uploaded to ${gcsUri}`);

//         const pdfBuffer = fs.readFileSync(req.file.path);
//         const summary = await processWithGemini(pdfBuffer);

//         res.json({ summary, gcsUri });
//     } catch (err) {
//         console.error("Upload error:", err);
//         res.status(500).send("Error processing PDF.");
//     }
// });

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
