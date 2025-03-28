const express = require("express");
const Category = require("../models/Category");
const { protect, isAdmin } = require("../middleware/authMiddleware");
const router = express.Router();

// Get all categories
router.get("/get", async (req, res) => {
  try {
    const categories = await Category.find();
    res.json(categories);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// Add a new category
router.post("/insert", protect, isAdmin, async (req, res) => {
  const { name, isSecondary } = req.body;
  let { parentId } = req.body;

  if (!parentId) parentId = null;

  try {
    const category = new Category({ name, isSecondary, parentId });
    await category.save();
    res.status(201).json(category);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

router.delete("/delete/:id", protect, isAdmin, async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);

    if (!product) {
      return res.status(404).json({ message: "Category not found" });
    }

    res.json({ message: "Category deleted successfully" });
  } catch (error) {
    console.error("Delete error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
