const { Schema, model, models } = require("mongoose");

const cacheSchema = new Schema({
  key: { type: String, required: true, unique: true },
  data: { type: Schema.Types.Mixed, required: true },
  expiresAt: { type: Date, required: true },
});

const Cache = models.Cache || model("Cache", cacheSchema);

async function getCachedData(key) {
  const entry = await Cache.findOne({ key, expiresAt: { $gt: new Date() } });
  return entry ? entry.data : null;
}

async function setCachedData(key, data, ttl = 3600) {
  const expiresAt = new Date(Date.now() + ttl * 1000);
  await Cache.findOneAndUpdate(
    { key },
    { data, expiresAt },
    { upsert: true, new: true }
  );
}

module.exports = { getCachedData, setCachedData };
