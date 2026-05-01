const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    name:        { type: String, required: true, unique: true },
    description: { type: String },
    price:       { type: Number, required: true },
    inventory:   { type: Number, default: 0, min: 0 },
    isAvailable: { type: Boolean, default: true, required: true },
    category:    { type: mongoose.Schema.ObjectId, ref: "Category", required: true },
    orders:      [{ type: mongoose.Schema.ObjectId, ref: "Order" }]
  }
);

module.exports = mongoose.model("Product", productSchema);
