const cors = require("cors");
require("dotenv").config();

const corsMiddleware = cors({
  origin: process.env.ALLOWED_ORIGINS?.split(",") || ["http://localhost:5173"],
  credentials: true,
});

module.exports = corsMiddleware;
