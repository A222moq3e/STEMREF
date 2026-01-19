const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, { dbName: "stemref" });
    console.log("DB Connected Successfully");
  } catch (error) {
    console.error("DB Connection Failed:", error);
    process.exit(1); // Exit the process with failure
  }
};

module.exports = connectDB;
