const User = require("../models/User");

// Register User
const registerUser = async (req, res) => {
  console.log("Received Data in Backend:", req.body); // 🛠 Debugging log

  const { first_name, last_name, email, password } = req.body;

  if (!first_name || !last_name || !email || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    const user = await User.create({
      first_name,
      last_name,
      email,
      password, // You should hash this before saving in production
    });

    res.status(201).json({
      _id: user._id,
      first_name: user.first_name,
      last_name: user.last_name,
      email: user.email,
    });
  } catch (error) {
    console.error("Error:", error.message); // 🛠 Debugging log
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = { registerUser };
