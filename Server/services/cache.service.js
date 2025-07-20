const mongoose = require("mongoose");

const cacheSchema = new mongoose.Schema({
  key: { type: String, required: true, unique: true },
  data: { type: mongoose.Schema.Types.Mixed, required: true },
  expiresAt: { type: Date, required: true },
});

const Cache = mongoose.models.Cache || mongoose.model("Cache", cacheSchema);

// Get cached data by key if not expired
async function getCachedData(key) {
  const entry = await Cache.findOne({ key, expiresAt: { $gt: new Date() } });
  return entry ? entry.data : null;
}

// Set cache with TTL (in seconds)
async function setCachedData(key, data, ttl = 3600) {
  const expiresAt = new Date(Date.now() + ttl * 1000);
  await Cache.findOneAndUpdate(
    { key },
    { data, expiresAt },
    { upsert: true, new: true }
  );
}

module.exports = { getCachedData, setCachedData };
