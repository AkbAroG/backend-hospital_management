import mongoose from "mongoose";

export const dbConnection = () => {
  mongoose
    .connect(
      process.env.MONGO_URI ||
        "mongodb+srv://akbaroofficial041_db_user:1PtvbNQeH8mCn2R3@cluster0.p13c9sc.mongodb.net/hospital_system"
    )
    .then(() => {
      console.log("Connected to database!");
    })
    .catch((err) => {
      console.log("Some error occured while connecting to database:", err);
    });
};
