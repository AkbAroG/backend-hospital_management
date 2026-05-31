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

const app = express();
config();

// app.use(
//   cors({
//     origin: [process.env.FRONTEND_URL_ONE, process.env.FRONTEND_URL_TWO],

//     method: ["GET", "POST", "DELETE", "PUT"],
//     credentials: true,
//   })
// );



app.use(cors({
  origin: ["http://localhost:5174", "http://localhost:5173"], // React Vite
  credentials: true
}));

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: "/tmp/",
  })
);
app.use("/api/v1/message", messageRouter);
app.use("/api/v1/user", userRouter);
app.use("/api/v1/appointment", appointmentRouter);
app.use("/api/v1/payment", paymentRouter);
app.use("/api/v1/labreport", labReportRouter);
app.use("/api/v1/emergency", emergencyRouter);

dbConnection();

app.use(errorMiddleware);
export default app;
