const express = require("express");
const multer = require("multer");
const { put } = require("@vercel/blob");
const { verifyToken } = require('../middleware/auth');
const router = express.Router();

// Use memory storage (we don't want to save files locally)
const storage = multer.memoryStorage();
const upload = multer({ storage });

router.post("/", verifyToken, upload.single("file"), async (req, res) => {
  try {
    console.log("Upload request received from user:", req.user.id);
    const file = req.file;

    if (!file) {
      console.log("No file in request");
      return res.status(400).json({ error: "No file uploaded" });
    }

    console.log("File received:", file.originalname, "Size:", file.size);

    const blob = await put(file.originalname, file.buffer, {
      access: "public", // or 'private' if you want it to be secure
    });

    console.log("Blob uploaded successfully:", blob.url);
    res.json({ url: blob.url }); // return the hosted image URL
  } catch (err) {
    console.error("Blob upload error:", err);
    res.status(500).json({ error: "Upload failed" });
  }
});

module.exports = router;
