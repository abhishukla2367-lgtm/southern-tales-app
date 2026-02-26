/**
 * migrate-stock.js
 * ─────────────────────────────────────────────────────────────────
 * One-time script: sets stock = 10 (and available = true) on every
 * menu item that currently has no stock field.
 *
 * Run once from your project root:
 *   node migrate-stock.js
 *
 * Safe to re-run — the filter { stock: { $exists: false } } means
 * items that already have stock set will NOT be touched.
 * ─────────────────────────────────────────────────────────────────
 */

const mongoose = require("mongoose");
require("dotenv").config(); // loads MONGO_URI from your .env
const dns = require("node:dns");

dns.setServers(["8.8.8.8", "1.1.1.1"]);
const DEFAULT_STOCK = 40; // ← Change this to whatever makes sense for your restaurant

async function migrate() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log("✅ Connected to MongoDB");

  const result = await mongoose.connection
    .collection("menu") // must match the collection name in your schema
    .updateMany(
      { stock: { $exists: false } },          // only items without stock
      {
        $set: {
          stock:     DEFAULT_STOCK,
          available: true,                     // mark them available immediately
        },
      }
    );

  console.log(`✅ Migration complete: ${result.modifiedCount} items updated with stock = ${DEFAULT_STOCK}`);
  await mongoose.disconnect();
}

migrate().catch((err) => {
  console.error("❌ Migration failed:", err);
  process.exit(1);
});