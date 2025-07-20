const cors = require("cors");

const corsMiddleware = cors({
  origin: [
    "http://127.0.0.1:5173",
    "http://localhost:5173",
  ],
});

module.exports = corsMiddleware;
