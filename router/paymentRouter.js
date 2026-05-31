import express from "express";
import { createPaymentIntent, updatePaymentStatus } from "../controller/paymentController.js";
import { isPatientAuthenticated } from "../middlewares/auth.js";

const router = express.Router();

router.post("/create-payment-intent", isPatientAuthenticated, createPaymentIntent);
router.put("/update-status/:id", isPatientAuthenticated, updatePaymentStatus);

export default router;
