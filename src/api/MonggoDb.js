// server.js
import express from "express";
import mongoose from "mongoose";
import cors from "cors";

const url = import.meta.env.VITE_DBURL;
export {
  url
};

const app = express();
app.use(cors());
app.use(express.json());

// Koneksi ke MongoDB
mongoose
  .connect(import.meta.env.VITE_DBURL)
  .then(() => console.log("Connected to MongoDB"))
  .catch(err => console.error("Could not connect to MongoDB", err));

// Contoh rute untuk mendapatkan data
app.get("/api/login", async (req, res) => {
  try {
    const data = await YourModel.find({});
    res.json(data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
