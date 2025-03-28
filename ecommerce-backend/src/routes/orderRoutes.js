const express = require("express");
const Order = require("../models/Order");
const Product = require("../models/Product");
const { protect } = require("../middleware/authMiddleware"); // Keep this for protected routes

const router = express.Router();

// Create an order (supports both logged-in users and guests)
router.post("/", async (req, res) => {
  const { user, guestEmail, guestName, orderItems, totalPrice } = req.body;

  try {
    // Validate products before saving order
    for (const item of orderItems) {
      const product = await Product.findById(item.product);
      if (!product) {
        return res
          .status(400)
          .json({ message: `Product not found: ${item.product}` });
      }
      if (product.stock < item.quantity) {
        return res
          .status(400)
          .json({ message: `Not enough stock for ${product.name}` });
      }
    }

    // Reduce stock for each ordered product
    for (const item of orderItems) {
      await Product.findByIdAndUpdate(item.product, {
        $inc: { stock: -item.quantity },
      });
    }

    const orderData = user
      ? { user, orderItems, totalPrice }
      : { guestEmail, guestName, orderItems, totalPrice };

    const order = new Order(orderData);
    await order.save();

    res.status(201).json(order);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// Get all orders (Admin only)
router.get("/", protect, async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("user", "name email") // Populate user details if available
      .populate("orderItems.product"); // Populate product details

    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// Get a single order by ID (Admin only)
router.get("/:id", protect, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate("user", "name email")
      .populate("orderItems.product");

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.json(order);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
