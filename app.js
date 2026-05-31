// import express from "express";
// import { dbConnection } from "./database/dbConnection.js";
// import { config } from "dotenv";
// import cookieParser from "cookie-parser";
// import cors from "cors";
// import fileUpload from "express-fileupload";
// import { errorMiddleware } from "./middlewares/error.js";
// import messageRouter from "./router/messageRouter.js";
// import userRouter from "./router/userRouter.js";
// import appointmentRouter from "./router/appointmentRouter.js";
// import paymentRouter from "./router/paymentRouter.js";
// import labReportRouter from "./router/labReportRouter.js";
// import emergencyRouter from "./router/emergencyRouter.js";

// const app = express();
// config();

// // app.use(
// //   cors({
// //     origin: [process.env.FRONTEND_URL_ONE, process.env.FRONTEND_URL_TWO],

// //     method: ["GET", "POST", "DELETE", "PUT"],
// //     credentials: true,
// //   })
// // );



// app.use(cors({
//   origin: ["http://localhost:5174", "http://localhost:5173"], // React Vite
//   credentials: true
// }));

// app.use(cookieParser());
// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));

// app.use(
//   fileUpload({
//     useTempFiles: true,
//     tempFileDir: "/tmp/",
//   })
// );
// app.use("/api/v1/message", messageRouter);
// app.use("/api/v1/user", userRouter);
// app.use("/api/v1/appointment", appointmentRouter);
// app.use("/api/v1/payment", paymentRouter);
// app.use("/api/v1/labreport", labReportRouter);
// app.use("/api/v1/emergency", emergencyRouter);

// dbConnection();

// app.use(errorMiddleware);
// export default app;
import express from "express";
import { dbConnection } from "./database/dbConnection.js";
import { config } from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import fileUpload from "express-fileupload";

import { errorMiddleware } from "./middlewares/error.js";

import messageRouter from "./router/messageRouter.js";
import userRouter from "./router/userRouter.js";
import appointmentRouter from "./router/appointmentRouter.js";
import paymentRouter from "./router/paymentRouter.js";
import labReportRouter from "./router/labReportRouter.js";
import emergencyRouter from "./router/emergencyRouter.js";

config();

const app = express();


// =======================
// SAFE DB CONNECTION (VERCEL FIX)
// =======================
let isConnected = false;

const connectDB = async () => {
  if (isConnected) return;
  await dbConnection();
  isConnected = true;
};

app.use(async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (err) {
    next(err);
  }
});


// =======================
// CORS CONFIG
// =======================
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "http://localhost:5174",
      process.env.FRONTEND_URL_ONE,
      process.env.FRONTEND_URL_TWO,
    ],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
  })
);


// =======================
// MIDDLEWARES
// =======================
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: "/tmp/",
  })
);


// =======================
// ROUTES
// =======================
app.use("/api/v1/message", messageRouter);
app.use("/api/v1/user", userRouter);
app.use("/api/v1/appointment", appointmentRouter);
app.use("/api/v1/payment", paymentRouter);
app.use("/api/v1/labreport", labReportRouter);
app.use("/api/v1/emergency", emergencyRouter);


// =======================
// HEALTH CHECK (VERY IMPORTANT)
// =======================
app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Hospital Management Backend is running 🚀",
  });
});


// =======================
// ERROR HANDLING
// =======================
app.use(errorMiddleware);

export default app;