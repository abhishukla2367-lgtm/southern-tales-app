/**
 * migrate-menu-ids.js
 *
 * ONE-TIME MIGRATION SCRIPT
 * Converts all menu documents whose _id is a MongoDB ObjectId
 * into documents with a plain string _id (e.g. "699f...b972").
 *
 * Run ONCE from your project root:
 *   node migrate-menu-ids.js
 *
 * Safe to run multiple times — skips docs that already have string _ids.
 */

require("dotenv").config();
const mongoose = require("mongoose");
const dns = require("node:dns");
dns.setServers(["8.8.8.8", "1.1.1.1"]);

const MONGO_URI = process.env.MONGO_URI || process.env.MONGODB_URI;

async function migrate() {
  console.log("🔌 Connecting to MongoDB...");
  await mongoose.connect(MONGO_URI);
  console.log("✅ Connected\n");

  // Use the raw MongoDB collection to bypass all Mongoose schema casting
  const col = mongoose.connection.collection("menu");

  const allDocs = await col.find({}).toArray();
  console.log(`📦 Found ${allDocs.length} total documents in 'menu' collection\n`);

  let migrated = 0;
  let skipped  = 0;

  for (const doc of allDocs) {
    const isObjectId = doc._id && typeof doc._id === "object" && doc._id._bsontype === "ObjectId";

    if (!isObjectId) {
      console.log(`⏭  Skipping "${doc.name}" — _id is already a string: "${doc._id}"`);
      skipped++;
      continue;
    }

    const oldId  = doc._id;
    const newId  = oldId.toHexString();   // "699f3418ed8196addc26b972"
    const newDoc = { ...doc, _id: newId };

    try {
      await col.insertOne(newDoc);
      await col.deleteOne({ _id: oldId });
      console.log(`✅ Migrated "${doc.name}": ObjectId → "${newId}"`);
      migrated++;
    } catch (err) {
      if (err.code === 11000) {
        // String version already exists — delete the ObjectId duplicate
        await col.deleteOne({ _id: oldId });
        console.log(`🔁 Duplicate cleaned for "${doc.name}"`);
        migrated++;
      } else {
        console.error(`❌ Failed to migrate "${doc.name}":`, err.message);
      }
    }
  }

  console.log(`
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✅ Migration complete
   Migrated : ${migrated}
   Skipped  : ${skipped}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);

  await mongoose.disconnect();
  process.exit(0);
}

migrate().catch((err) => {
  console.error("❌ Migration failed:", err);
  process.exit(1);
});