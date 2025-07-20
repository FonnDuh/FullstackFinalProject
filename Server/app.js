const express = require("express");
const connectDB = require("./services/db.service");
const router = require("./router/router");
const chalk = require("chalk");
const corsMiddleware = require("./middlewares/cors");
const loggerMiddleware = require("./services/logger.service");
const { errorHandler } = require("./middlewares/errorHandler");

const app = express();
const PORT = process.env.PORT;

app.use(express.json());

app.use(express.static("./public"));

app.use(loggerMiddleware());

app.use(corsMiddleware);

app.use(router);

app.use(errorHandler);

connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(chalk.green.bold.cyan(`Server is running on port ${PORT}`));
    });
  })
  .catch((err) => {
    console.log("Database connection failed: ", err);
  });
