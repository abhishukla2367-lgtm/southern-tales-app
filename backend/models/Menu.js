const mongoose = require("mongoose");

const menuSchema = new mongoose.Schema({
  name: {
    type:     String,
    required: [true, "Dish name is required"],
    trim:     true,
  },
  description: {
    type:    String,
    default: "",
  },
  price: {
    type:     Number,
    required: [true, "Price is required"],
    min:      [0, "Price cannot be negative"],
  },
  category: {
    type:     String,
    required: true,
  },
  image: {
    type:    String,
    default: "",
  },
  veg: {
    type:    Boolean,
    default: true,
  },
  vegan: {
    type:    Boolean,
    default: false,
  },
  dietary: {
    type:    Boolean,
    default: false,
  },

  // ─── Stock Management ──────────────────────────────────────────────────────
  stock: {
    type:     Number,
    required: [true, "Stock quantity is required"],
    default:  0,
    min:      [0, "Stock cannot be negative"],
  },

  // ─── Availability ──────────────────────────────────────────────────────────
  available: {
    type:    Boolean,
    default: false,
  },
}, {
  timestamps: true,
  collection: "menu",
  // ✅ No toJSON transform — _id serialization handled in the controller
});

// ─── Pre-save Hook ────────────────────────────────────────────────────────────
menuSchema.pre("save", function (next) {
  this.available = this.stock > 0;
  next();
});

// ─── Pre-update Hook ──────────────────────────────────────────────────────────
menuSchema.pre(["findOneAndUpdate", "updateOne"], function (next) {
  const update = this.getUpdate();
  if (update && update.stock !== undefined) {
    update.available = Number(update.stock) > 0;
  }
  next();
});

module.exports = mongoose.model("Menu", menuSchema);