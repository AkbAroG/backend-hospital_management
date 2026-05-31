// import mongoose from "mongoose";

// export const dbConnection = () => {
//   mongoose
//     .connect(
//       process.env.MONGO_URI ||
//         "mongodb+srv://akbaroofficial041_db_user:1PtvbNQeH8mCn2R3@cluster0.p13c9sc.mongodb.net/hospital_system"
//     )
//     .then(() => {
//       console.log("Connected to database!");
//     })
//     .catch((err) => {
//       console.log("Some error occured while connecting to database:", err);
//     });
// };

import mongoose from "mongoose";

export const dbConnection = async () => {
  try {
    if (mongoose.connection.readyState === 1) {
      console.log("Already connected to DB 🚀");
      return;
    }

    const MONGO_URI = process.env.MONGO_URI;

    if (!MONGO_URI) {
      throw new Error("MONGO_URI is missing in environment variables");
    }

    await mongoose.connect(MONGO_URI);

    console.log("✅ Connected to database!");
  } catch (err) {
    console.log("❌ DB connection error:", err.message);
    throw err;
  }
};