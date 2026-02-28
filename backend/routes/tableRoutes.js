const express = require("express");
const router  = express.Router();
const Order   = require("../models/Order"); // adjust path if your model is elsewhere

// GET /api/tables
// Returns T1–T20 with live available/occupied status based on active orders
router.get("/", async (req, res) => {
  try {
    // Find all tableNumbers currently held by active walkin/dinein orders
    const occupiedTables = await Order.distinct("tableNumber", {
      orderType:   { $in: ["walkin", "dinein"] },
      status:      { $nin: ["Completed", "Cancelled"] },
      tableNumber: { $exists: true, $ne: null },
    });

    // Build T1–T20 list with live status
    const tables = Array.from({ length: 20 }, (_, i) => {
      const tableNumber = `T${i + 1}`;
      return {
        tableNumber,
        status: occupiedTables.includes(tableNumber) ? "occupied" : "available",
      };
    });

    res.status(200).json({ tables });
  } catch (err) {
    console.error("❌ Failed to fetch tables:", err.message);
    res.status(500).json({ message: "Failed to fetch tables", error: err.message });
  }
});

module.exports = router;