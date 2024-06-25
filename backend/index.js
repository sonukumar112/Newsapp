require("dotenv").config();
const port = process.env.PORT;
const express = require("express");
const app = express();
const jwt = require("jsonwebtoken");
const cors = require("cors");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

app.use(express.json());
app.use(cors());

// Database Connection
mongoose.connect(process.env.MONGO_URL);

// Schema for Notes
const NoteSchema = new mongoose.Schema({
  id: {
    type: String,
    unique: true,
  },
  title: {
    type: String,
  },
  notes: {
    type: String,
  },
});

// Schema for News
const NewsSchema = new mongoose.Schema({
  id: {
    type: String,
    unique: true,
  },
  title: {
    type: String,
  },
  description: {
    type: String,
  },
  urlToImage: {
    type: String,
  },
  url: {
    type: String,
  },
});


// Schema for Users
const UserSchema = new mongoose.Schema({
  username: {
    type: String,
  },
  email: {
    type: String,
    unique: true,
  },
  password: {
    type: String,
  },
  savedNews: [NewsSchema],
  notesList: [NoteSchema],
  date: {
    type: Date,
    default: Date.now,
  },
});

const User = mongoose.model("User", UserSchema);

app.get("/",(req,res) => {
  res.send("Server is running....");
})

// Middleware to fetch user based on token
const fetchUser = async (req, res, next) => {
  const token = req.header('auth-token');
  if (!token) {
    return res.status(401).send({ errors: "Please authenticate using valid token" });
  }

  try {
    const data = jwt.verify(token, process.env.SECRET_KEY);
    req.user = data.user;
    next();
  } catch (error) {
    res.status(401).send({ errors: "Please authenticate using valid token" });
  }
};

// Signup API
app.post("/signup", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ success: false, errors: "Existing user found with same email address" });
    }

    const newUser = new User({
      username: name,
      email,
      password: await bcrypt.hash(password, 10),
      savedNews: [],
      notesList: [],
    });

    await newUser.save();

    const token = jwt.sign({ user: { id: newUser.id } }, process.env.SECRET_KEY);
    res.json({ success: true, token });
  } catch (error) {
    console.error("Error in signup:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Login API
app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ success: false, errors: "User not found" });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ success: false, errors: "Wrong password" });
    }

    const token = jwt.sign({ user: { id: user.id } }, process.env.SECRET_KEY);
    res.json({ success: true, token });
  } catch (error) {
    console.error("Error in login:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Add to Saved News API
app.post("/addtosave", fetchUser, async (req, res) => {
  try {
      const { id, title, description, urlToImage, url } = req.body;

      let userData = await User.findOne({ _id: req.user.id });
      if (!userData) {
          return res.status(404).json({ error: "User not found" });
      }

      const newsItem = { id, title, description, urlToImage, url };
      userData.savedNews.push(newsItem);
      await userData.save();

      res.status(200).json({ message: "News saved successfully", newsItem });
  } catch (error) {
      console.error("Error saving news:", error);
      res.status(500).json({ error: "Internal server error" });
  }
});

// Get Saved News API
app.post("/getsavednews", fetchUser, async (req, res) => {
  try {
      console.log("Fetching saved news");

      let userData = await User.findOne({ _id: req.user.id });

      if (!userData) {
          return res.status(404).json({ error: "User not found" });
      }

      res.json(userData.savedNews);
  } catch (error) {
      console.error("Error fetching saved news:", error);
      res.status(500).json({ error: "Internal server error" });
  }
});

// Remove from Saved News API
app.post("/removefromsave", fetchUser, async (req, res) => {
  try {
    const { id } = req.body;

    if (!id) {
      return res.status(400).json({ error: "Invalid news ID" });
    }

    let userData = await User.findOne({ _id: req.user.id });

    if (!userData) {
      return res.status(404).json({ error: "User not found" });
    }

    userData.savedNews = userData.savedNews.filter(news => news.id !== id);

    await User.findOneAndUpdate({ _id: req.user.id }, { savedNews: userData.savedNews });
    res.json({ message: "Deleted successfully" });
  } catch (error) {
    console.error("Error deleting saved news:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Add to Notes API
app.post("/addtonote", fetchUser, async (req, res) => {
  try {
    const { note } = req.body;

    if (!note || !note.id) {
      return res.status(400).json({ error: "Invalid note" });
    }

    let userData = await User.findOne({ _id: req.user.id });

    if (!userData) {
      return res.status(404).json({ error: "User not found" });
    }

    const existingNote = userData.notesList.find(n => n.id === note.id);
    if (!existingNote) {
      userData.notesList.push(note);
    } else {
      return res.status(400).json({ error: "Note already exists" });
    }

    await userData.save();
    res.json({ message: "Added successfully" });
  } catch (error) {
    console.error("Error adding note:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Get Notes API
app.post("/getnotes", fetchUser, async (req, res) => {
  try {
    let userData = await User.findOne({ _id: req.user.id });

    if (!userData) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json(userData.notesList);
  } catch (error) {
    console.error("Error fetching notes:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Delete Note API
app.post("/deletenote", fetchUser, async (req, res) => {
  try {
    const { id } = req.body;

    if (!id) {
      return res.status(400).json({ error: "Invalid note ID" });
    }

    let userData = await User.findOne({ _id: req.user.id });

    if (!userData) {
      return res.status(404).json({ error: "User not found" });
    }

    userData.notesList = userData.notesList.filter(note => note.id !== id);

    await User.findOneAndUpdate({ _id: req.user.id }, { notesList: userData.notesList });
    res.json({ message: "Deleted successfully" });
  } catch (error) {
    console.error("Error deleting note:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Server Listening
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
