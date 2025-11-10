const mongoose = require("mongoose");

export default async () => {
  try {
    await mongoose.connect(process.env.DB_URI);
    console.log("Database Connected.");
  } catch (err) {
    console.error(`Database Connection Error: ${err}`);
    process.exit(1);
  }
};
