const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGO_URI;

    if (!mongoURI) {
      console.error("❌ MONGO_URI is not defined in .env file");
      process.exit(1);
    }

    const connection = await mongoose.connect(mongoURI);

    console.log("----------------------------------------");
    console.log("       MONGODB CONNECTED");
    console.log("----------------------------------------");
    console.log(`Database: ${connection.connection.name}`);
    console.log(`Host: ${connection.connection.host}`);
    console.log("----------------------------------------");
  } catch (error) {
    console.error("----------------------------------------");
    console.error("❌ MONGODB CONNECTION FAILED");
    console.error("----------------------------------------");
    console.error(error.message);
    console.error("----------------------------------------");

    process.exit(1);
  }
};

module.exports = connectDB;
