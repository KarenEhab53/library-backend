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
const Contact = require("./models/Contact");
const Author = require("./models/Author");
const Book = require("./models/Book");
const Product = require("./models/Product");
const Students = require("./models/Students");
const ClassRoom = require("./models/ClassRoom");

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
//post products
app.post("/api/product", async (req, res) => {
  try {
    const { name, category, price } = req.body;
    if (!name || !category || !price) {
      return res.status(400).json({
        success: false,
        msg: "name , category and price are required",
      });
    }
    const product = await Product.create({ name, category, price });
    res.json({
      success: true,
      msg: "Product created successfully",
      data: product,
    });
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ success: false, msg: "Server error", error: err.message });
  }
});
// get products
app.get("/api/products", async (req, res) => {
  try {
    const { category } = req.query;

    let filter = {};
    if (category) {
      filter.category = category;
    }
    const products = await Product.find(filter);
    const count = await Product.countDocuments();
    res.json({
      success: true,
      msg: "Products fetched successfully",
      totalProducts: count,
      data: products,
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
//delete product
app.delete("/api/product/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await Product.deleteMany({ author: id });
    const product = await Product.findByIdAndDelete(id);
    if (!product) {
      return res.status(404).json({ success: false, msg: "Product not found" });
    }
    res.json({
      success: true,
      msg: "Product deleted successfully",
    });
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ success: false, msg: "Server error", error: err.message });
  }
});
//post students
app.post("/api/student", async (req, res) => {
  try {
    const { name, email } = req.body;

    if (!name || !email) {
      return res.status(400).json({
        success: false,
        msg: "Name and email are required",
      });
    }

    const student = await Students.create({ name, email });

    res.status(201).json({
      success: true,
      msg: "Student created successfully",
      data: student,
    });
  } catch (err) {
    console.error(err);

    // Handle duplicate email error
    if (err.code === 11000) {
      return res.status(400).json({
        success: false,
        msg: "Email already exists",
      });
    }

    res.status(500).json({
      success: false,
      msg: "Server error",
      error: err.message,
    });
  }
});

//get all students
app.get("/api/students", async (req, res) => {
  try {
    const student = await Students.find();
    const count = await Students.countDocuments();
    res.json({
      success: true,
      msg: "Students fetched successfully",
      totalStudents: count,
      data: student,
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
//delete student
app.delete("/api/student/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const student = await Students.findByIdAndDelete(id);
    if (!student) {
      return res.status(404).json({ success: false, msg: "student not found" });
    }
    res.json({
      success: true,
      msg: "Student deleted successfully",
    });
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ success: false, msg: "Server error", error: err.message });
  }
});
//post classroom
app.post("/api/classroom", async (req, res) => {
  try {
    const { name, students } = req.body;

    if (!name || !students || students.length === 0) {
      return res.status(400).json({
        success: false,
        msg: "name and students are required",
      });
    }

    const classroom = await ClassRoom.create({
      name,
      students,
    });

    res.status(201).json({
      success: true,
      msg: "classroom created successfully",
      data: classroom,
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

//get all ClassRooms
app.get("/api/classrooms", async (req, res) => {
  try {
    const classroom = await ClassRoom.find().populate("students", "name");
    const count = await ClassRoom.countDocuments();
    res.json({
      success: true,
      msg: "classroom fetched successfully",
      totalStudents: count,
      data: classroom,
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
//delete student
app.delete("/api/classroom/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const classroom = await ClassRoom.findByIdAndDelete(id);
    if (!ClassRoom) {
      return res
        .status(404)
        .json({ success: false, msg: "ClassRoom not found" });
    }
    res.json({
      success: true,
      msg: "ClassRoom deleted successfully",
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
