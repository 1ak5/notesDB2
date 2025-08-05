const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const bcrypt = require("bcrypt");
const cors = require("cors");
const path = require("path");

const app = express();
app.use(bodyParser.json());
app.use(cors());
app.use(express.static("public")); // Serve frontend

// 📦 MongoDB connection
mongoose.connect("mongodb+srv://suryawanshiaditya915:j28ypFv6unzrodIz@notesapp.d3r8gkc.mongodb.net/notes-app?retryWrites=true&w=majority", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  

  
});




// 🧾 User schema
const userSchema = new mongoose.Schema({
  username: String,
  pin: String,
  notes: [String],
});

const User = mongoose.model("User", userSchema);

// ✅ Register new user
app.post("/register", async (req, res) => {
  try {
    const { username, pin } = req.body;
    const existing = await User.findOne({ username });
    if (existing) return res.status(400).json({ message: "User already exists" });

    const hashedPin = await bcrypt.hash(pin, 10);
    const user = new User({ username, pin: hashedPin, notes: [] });
    await user.save();
    res.json({ message: "User registered" });
  } catch (err) {
    console.error("Register error:", err);
    res.status(500).json({ message: "Server error during registration" });
  }
});

// 🔐 Login
app.post("/login", async (req, res) => {
  try {
    const { username, pin } = req.body;
    const user = await User.findOne({ username });
    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    const isMatch = await bcrypt.compare(pin, user.pin);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

    res.json({ message: "Login success", notes: user.notes });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: "Server error during login" });
  }
});

// 📝 Save Notes
app.post("/savenotes", async (req, res) => {
  try {
    const { username, notes } = req.body;
    await User.updateOne({ username }, { $set: { notes } });
    res.json({ message: "Notes saved" });
  } catch (err) {
    console.error("Save notes error:", err);
    res.status(500).json({ message: "Server error during saving notes" });
  }
});

app.listen(3000, () => {
  console.log("Server started on http://localhost:3000");
});
