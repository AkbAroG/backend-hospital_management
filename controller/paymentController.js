import { catchAsyncErrors } from "../middlewares/catchAsyncErrors.js";
import ErrorHandler from "../middlewares/error.js";
import Stripe from "stripe";
import { config } from "dotenv";
import { Appointment } from "../models/appointmentSchema.js";

config();

// Provide a fallback so the server doesn't crash if the key isn't set in .env yet
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "sk_test_dummy_key_to_prevent_crash");

export const createPaymentIntent = catchAsyncErrors(async (req, res, next) => {
  const { amount } = req.body;

  if (!amount) {
    return next(new ErrorHandler("Amount is required for payment", 400));
  }

  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount * 100, // Stripe expects amount in cents
      currency: "usd",
      // Optionally add metadata, receipt_email, etc.
    });

    res.status(200).json({
      success: true,
      clientSecret: paymentIntent.client_secret,
    });
  } catch (error) {
    return next(new ErrorHandler(error.message, 500));
  }
});

export const updatePaymentStatus = catchAsyncErrors(async (req, res, next) => {
  const { id } = req.params;
  const { paymentId, status, amount } = req.body;

  let appointment = await Appointment.findById(id);
  
  if (!appointment) {
    return next(new ErrorHandler("Appointment not found!", 404));
  }

  appointment.paymentInfo = {
    paymentId,
    status,
    amount,
  };

  await appointment.save();

  res.status(200).json({
    success: true,
    message: "Payment status updated successfully!",
  });
});
