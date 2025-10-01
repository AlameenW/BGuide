import express from "express";
import cors from "cors";
import guideData from "./data/guideData.js";
import dotenv from './config/dotenv.js'
import guideController from "./controllers/guideController.js";
const app = express();
app.use(cors());

app.use("/public", express.static("./public"));
app.get("/guides", guideController.getGuides);
app.get("/guides/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const guide = guideData.find((g) => g.id == id);
  if (guide) {
    res.status(200).json(guide);
  } else {
    res.status(404).json({ error: "Guide Not Found" });
  }
});

app.use((req, res) => {
  res.status(404).json({
    error: "404 - Not Found",
    message: `Cannot ${req.method} ${req.path}`,
  });
});

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`🚀 Server listening on http://localhost:${PORT}`);
});
