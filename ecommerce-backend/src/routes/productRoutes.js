const express = require("express");
const Product = require("../models/Product");
const router = express.Router();
const { protect, isAdmin } = require("../middleware/authMiddleware");

// Get all products
router.get("/get", async (req, res) => {
  try {
    const products = await Product.find().populate("category");
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// Add a new product
router.post("/add", protect, isAdmin, async (req, res) => {
  try {
    const {
      name,
      description,
      price,
      stock,
      primaryImage,
      secondaryImages = [],
      category,
    } = req.body;

    if (
      !name ||
      !description ||
      !price ||
      !stock ||
      !category ||
      !category._id ||
      !category.name
    ) {
      return res
        .status(400)
        .json({ message: "All required fields must be filled" });
    }

    const product = new Product({
      name,
      description,
      price,
      stock,
      primaryImage,
      secondaryImages,
      category: {
        _id: category._id,
        name: category.name,
      },
    });

    await product.save();
    res.status(201).json({ message: "Product created successfully", product });
  } catch (error) {
    console.error("Product creation error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

//delete a product

router.delete("/delete/:id", protect, isAdmin, async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json({ message: "Product deleted successfully" });
  } catch (error) {
    console.error("Delete error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
