const mongoose = require("mongoose");
const initData = require("./dashdata-img.js");
const Listing = require("../models/dashdata.js");
require("dotenv").config({ path: "../.env" }); 

const dbUrl = process.env.ATLASDB_URL;

if (!dbUrl) {
  console.error(" ATLASDB_URL is undefined! Check your .env file.");
  process.exit(1);
}

async function main() {
  try {
    await mongoose.connect(dbUrl, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 30000, 
    });
    console.log(" Connected to MongoDB");
    initDB();
  } catch (error) {
    console.error(" MongoDB Connection Error:", error);
    process.exit(1);
  }
}

const initDB = async () => {
  try {
    console.log("🔄 Initializing database...");

    initData.data = initData.data.map((obj) => ({
      ...obj,
      owner: "67e85288793ad53516366861",
    }));
    await Listing.insertMany(initData.data);
    console.log(" Data was initialized");
    mongoose.connection.close();
  } catch (error) {
    console.error(" Error initializing DB:", error);
  }
};
main();
