const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    category: {
      _id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Category",
        required: true,
      },
      name: { type: String, required: true },
    },
    stock: { type: Number, required: true, default: 0 },
    primaryImage: { type: String },
    secondaryImages: [{ type: String, default: [] }],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Product", productSchema);
