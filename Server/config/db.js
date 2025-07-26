const connectToLocalDB = require("../DB/mongodb/connectToMongodbLocally");
const connectToAtlas = require("../DB/mongoDB/connectToAtlas");

require("dotenv").config();

const ENVIRONMENT = process.env.ENVIRONMENT;
const DB = process.env.DB;

const connectDB = async () => {
  if (DB === "MONGODB") {
    if (ENVIRONMENT === "development") {
      await connectToLocalDB();
    }
    if (ENVIRONMENT === "production") {
      await connectToAtlas();
    }
  }
};

module.exports = connectDB;
