const express = require("express");
const connectDB = require("./DB/dbService");
const app = express();

const { PORT } = process.env;

app.use(express.json());

connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log("Server is running on port " + PORT);
    });
  })
  .catch((err) => {
    console.log("Database connection failed: ", err);
  });
