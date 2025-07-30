function buildUrl(endpoint, params = {}) {
  const url = new URL("https://api.themoviedb.org/3/" + endpoint);

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null) url.searchParams.set(key, value);
  });
  return url.toString();
}

module.exports = buildUrl;
