// Load environment variables
require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");

const app = express();
app.use(express.json());
// Database connection
async function dbConnection() {
  try {
    await mongoose.connect(
      process.env.DB_URL || "mongodb://127.0.0.1:27017/ProjectOne",
    );
    console.log("MongoDB connected successfully");
  } catch (err) {
    console.error("MongoDB connection error:", err);
  }
}

dbConnection();
// call schema
const Author = require("./models/Author");
const Book = require("./models/Book");

//post author name
app.post("/api/author", async (req, res) => {
  try {
    const { name } = req.body; // destructure 'name' from body
    if (!name) {
      return res.status(400).json({
        success: false,
        msg: "Name is required",
      });
    }

    const author = await Author.create({ name });
    res.json({
      success: true,
      msg: "Author created successfully",
      data: author,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      msg: "Server error",
      error: err.message,
    });
  }
});
//get authors
app.get("/api/authors", async (req, res) => {
  try {
    const author = await Author.find();
    const count = await Author.countDocuments();
    res.json({
      success: true,
      msg: "Authors fetched successfully",
      totalAuthors: count,
      data: author,
    });
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ success: false, msg: "Server error", error: err.message });
  }
});
// post books
app.post("/api/book", async (req, res) => {
  try {
    const { title, authorId } = req.body;
    if (!title || !authorId) {
      return res.status(400).json({
        success: false,
        msg: "title and author are required",
      });
    }
    const book = await Book.create({ title, authorId });
    res.json({
      success: true,
      msg: "Book created successfullu",
      data: book,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      msg: "Server error",
      error: err.message,
    });
  }
});
// get book populate with author
app.get("/api/books", async (req, res) => {
  try {
    const books = await Book.find().populate("authorId", "name");
    const count = await Book.countDocuments();
    res.json({
      success: true,
      msg: "Books fetched successfully",
      totalBooks: count,
      data: books,
    });
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ success: false, msg: "Server error", error: err.message });
  }
});
// delete author
app.delete("/api/author/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await Book.deleteMany({ author: id });
    const author = await Author.findByIdAndDelete(id);
    if (!author) {
      return res.status(404).json({ success: false, msg: "Author not found" });
    }
    res.json({
      success: true,
      msg: "Author and their books deleted successfully",
    });
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ success: false, msg: "Server error", error: err.message });
  }
});
//delete books
app.delete("/api/book/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const book = await Book.findByIdAndDelete(id);
    if (!book) {
      return res.status(404).json({ success: false, msg: "Book not found" });
    }
    res.json({
      success: true,
      msg: "Book deleted successfully",
    });
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ success: false, msg: "Server error", error: err.message });
  }
});
const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Server running on port ${port}`));
