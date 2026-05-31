// import app from "./app.js";
// import cloudinary from "cloudinary";
// import dotenv from "dotenv";

// dotenv.config();

// cloudinary.v2.config({
//   cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
//   api_key: process.env.CLOUDINARY_API_KEY,
//   api_secret: process.env.CLOUDINARY_API_SECRET,
// });

// // app.listen(process.env.PORT || 5000, () => {
// //   console.log(`Server listening at port ${process.env.PORT}`);
// // });

// const PORT = process.env.PORT || 5000;

// app.listen(PORT, () => {
//   console.log(`Server listening at port ${PORT}`);
// });
import app from "./app.js";
import cloudinary from "cloudinary";
import dotenv from "dotenv";

dotenv.config();


// =======================
// CLOUDINARY CONFIG
// =======================
cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});


// =======================
// LOCAL SERVER (ONLY FOR DEVELOPMENT)
// =======================
// NOTE: Vercel par ye file use nahi hoti
// Vercel uses /api/index.js instead

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});