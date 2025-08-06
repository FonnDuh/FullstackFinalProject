const MEDIA_TYPES = [
  "movie",
  "tv",
  "person",
  "company",
  "collection",
  "keyword",
  "multi",
];
const TRENDING_TYPES = ["all", "movie", "tv", "person"];
const POPULAR_TYPES = ["movie", "tv", "person"];
const BASE_TYPES = ["movie", "tv"];

function isMediaType(type) {
  return MEDIA_TYPES.includes(type);
}

function isBaseType(type) {
  return BASE_TYPES.includes(type);
}

function isTrendingType(type) {
  return TRENDING_TYPES.includes(type);
}
function isPopularType(type) {
  return POPULAR_TYPES.includes(type);
}

module.exports = { isMediaType, isBaseType, isTrendingType, isPopularType };
