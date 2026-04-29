const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name:          { type: String, required: true },
    username:      { type: String, required: true, unique: true },
    email:         { type: String, required: true, unique: true },
    phone:         { type: String },
    password:      { type: String, required: true },
    role:          { type: String, enum: ['customer', 'employee', 'admin'], default: 'customer' },
    loyaltyPoints: { type: Number, default: 0 }
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);