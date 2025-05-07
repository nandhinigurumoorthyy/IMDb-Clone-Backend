const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const { createDbConnection } = require("./db");
const UserModel = require("./model/user.model");
const app = express();
const Actor = require("./model/actor.model");
const Producer = require("./model/producer.model");
const Movie = require("./model/movie.model");

// Middleware
app.use(express.json());
app.use(
  cors({
    origin: ["http://localhost:5173", "http://0.0.0.0:10000", "https://imdb-clone-ui.netlify.app/"],
    methods: ["POST", "GET", "DELETE", "PUT"],
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
app.use(cookieParser());

// Middleware to verify JWT token
const verifyJwt = (req, res, next) => {
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({ message: "Authentication required" });
  }

  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET_KEY || "default_secret_key"
    );
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(403).json({ message: "Invalid or expired token" });
  }
};

// API Route to register a new user
app.post("/reg", async (req, res) => {
  try {
    const user = new UserModel(req.body);
    const result = await user.save();
    res.json({ status: "Success", user: result });
  } catch (err) {
    console.error("Error creating user:", err.message);
    res.status(500).json({ status: "ERROR", message: err.message });
  }
});

// API Route for login
app.post("/", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await UserModel.findOne({ email });
    if (!user) {
      return res
        .status(404)
        .json({ status: "ERROR", message: "No record exists" });
    }

    // (Note: Plain password comparison — not recommended for production. Use bcrypt later!)
    if (password !== user.password) {
      return res
        .status(401)
        .json({ status: "ERROR", message: "Incorrect email or password" });
    }

    const token = jwt.sign(
      { email: user.email, id: user._id, username: user.username },
      process.env.JWT_SECRET_KEY || "default_secret_key",
      { expiresIn: "1d" }
    );

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });

    res.json({
      status: "Success",
      message: "Login successful",
      user: { email: user.email, userid: user._id, username: user.username },
    });
  } catch (err) {
    console.error("Error logging in:", err.message);
    res.status(500).json({ status: "ERROR", message: "Internal server error" });
  }
});

// Create a new movie
app.post("/createnewmovie", async (req, res) => {
  try {
    const {
      title,
      releaseDate,
      genre,
      overview,
      actors,
      producers,
      userId,
      photolink,
      vote,
    } = req.body;

    // Create new movie
    const newMovie = new Movie({
      title,
      releaseDate,
      genre,
      overview,
      actors,
      producers,
      userId,
      photolink,
      vote,
    });

    await newMovie.save();
    res.status(201).json(newMovie);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Get all movies

// GET all movies (with optional filtering and pagination)
app.get("/movies", async (req, res) => {
  try {
    const { query, page = 1, limit = 10 } = req.query;
    const skip = (page - 1) * limit;
    const filters = {};

    if (query) {
      filters.$or = [
        { title: { $regex: query, $options: "i" } },
        { original_title: { $regex: query, $options: "i" } }, // Assuming you might have this field
        { overview: { $regex: query, $options: "i" } },
        { actors: { $regex: query, $options: "i" } },
        { producers: { $regex: query, $options: "i" } },
        { genre: { $regex: query, $options: "i" } },
        // Add more fields to search as needed
      ];
    }

    const movies = await Movie.find(filters).skip(skip).limit(parseInt(limit));
    const totalMovies = await Movie.countDocuments(filters);
    const totalPages = Math.ceil(totalMovies / limit);

    res.json({
      data: movies,
      currentPage: parseInt(page),
      totalPages,
      totalResults: totalMovies,
    });
  } catch (error) {
    console.error("Error fetching movies:", error);
    res.status(500).json({ message: "Failed to fetch movies" });
  }
});

// GET a specific movie by ID
app.get("/moviedetails/:_id", async (req, res) => {
  try {
    const movie = await Movie.findById(req.params._id);
    if (!movie) {
      return res.status(404).json({ message: "Movie not found" });
    }
    res.json(movie);
  } catch (error) {
    console.error("Error fetching movie:", error);
    res.status(500).json({ message: "Failed to fetch movie" });
  }
});

// Fetch movies added by a specific user
app.get('/api/user-movies/:userid', async (req, res) => {
    const { userid } = req.params;
    try {
      // Get movies added by this user
      const userMovies = await Movie.find({ userId: userid });
      res.status(200).json(userMovies);
    } catch (error) {
      console.error("Error fetching user's movies:", error);
      res.status(500).json({ message: "Failed to fetch user's movies" });
    }
  });


// 🛠 Update (Edit) a Movie
app.put("/api/movies/:id", async (req, res) => {
    const { id } = req.params;
    const updatedData = req.body;
  
    try {
      const movie = await Movie.findByIdAndUpdate(id, updatedData, { new: true });
  
      if (!movie) {
        return res.status(404).json({ message: "Movie not found" });
      }
  
      res.status(200).json(movie);
    } catch (error) {
      console.error("Error updating movie:", error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  });
  
  // 🗑 Delete a Movie
 app.delete("/api/movies/:id", async (req, res) => {
    const { id } = req.params;
  
    try {
      const movie = await Movie.findByIdAndDelete(id);
  
      if (!movie) {
        return res.status(404).json({ message: "Movie not found" });
      }
  
      res.status(200).json({ message: "Movie deleted successfully" });
    } catch (error) {
      console.error("Error deleting movie:", error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  });

// Start server safely
const PORT = process.env.PORT || 5000;
const HOSTNAME = process.env.HOSTNAME || "localhost";

app.listen(PORT, HOSTNAME, () => {
  createDbConnection();
  console.log(`Server running at http://${HOSTNAME}:${PORT}`);
});
