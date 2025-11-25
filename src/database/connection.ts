const mongoose = require("mongoose");
import config from "@/config";

export default async () => {
  try {
    await mongoose.connect(config.require("DB_URI"));
    console.log("Database Connected.");
  } catch (err) {
    console.error(`Database Connection Error: ${err}`);
    process.exit(1);
  }
};
