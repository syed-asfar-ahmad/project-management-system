const express = require("express");
const multer = require("multer");
const { put } = require("@vercel/blob");
const router = express.Router();

// Use memory storage (we don’t want to save files locally)
const storage = multer.memoryStorage();
const upload = multer({ storage });

router.post("/", upload.single("file"), async (req, res) => {
  try {
    const file = req.file;

    if (!file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const blob = await put(file.originalname, file.buffer, {
      access: "public", // or 'private' if you want it to be secure
    });

    res.json({ url: blob.url }); // return the hosted image URL
  } catch (err) {
    console.error("Blob upload error:", err);
    res.status(500).json({ error: "Upload failed" });
  }
});

module.exports = router;
