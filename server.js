const express = require("express");
const multer = require("multer");
const cors = require("cors");
const Replicate = require("replicate");

const app = express();
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 }
});

app.use(cors());

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN
});

app.get("/", (req, res) => {
  res.send("Farman AI Photo Enhancer Backend is running!");
});

app.post("/api/enhance", upload.single("image"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "Please upload an image" });
    }

    const image = `data:${req.file.mimetype};base64,${req.file.buffer.toString("base64")}`;

    const output = await replicate.run("nightmareai/real-esrgan", {
      input: {
        image,
        scale: 4,
        face_enhance: false
      }
    });

    res.json({ result: output });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Image enhancement failed" });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
