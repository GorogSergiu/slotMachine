const express = require("express");
const User = require("../models/User");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// Generate JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
};

// @route   POST /api/auth/register
// @desc    Register new admin
router.post("/admin/register", async (req, res) => {
  const { first_name, last_name, email, password } = req.body;

  const userExists = await User.findOne({ email });
  if (userExists)
    return res.status(400).json({ message: "User already exists" });

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await User.create({
    first_name,
    last_name,
    email,
    password: hashedPassword,
    isAdmin: true,
  });

  const token = generateToken(user._id);

  res.status(201).json({
    _id: user._id,
    first_name: user.first_name,
    last_name: user.last_name,
    email: user.email,
    isAdmin: user.isAdmin,
    token,
  });
});

// @route   POST /api/auth/login
// @desc    Admin login
router.post("/admin/login", async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (
    !user ||
    !(await bcrypt.compare(password, user.password)) ||
    !user.isAdmin
  ) {
    return res
      .status(401)
      .json({ message: "Invalid credentials or not an admin" });
  }

  const token = generateToken(user._id);

  res.json({
    _id: user._id,
    first_name: user.first_name,
    last_name: user.last_name,
    email: user.email,
    isAdmin: user.isAdmin,
    token,
  });
});

module.exports = router;
