import { catchAsyncErrors } from "../middlewares/catchAsyncErrors.js";
import ErrorHandler from "../middlewares/error.js";
import { AmbulanceRequest, HospitalStats } from "../models/emergencySchema.js";

export const requestAmbulance = catchAsyncErrors(async (req, res, next) => {
  const { patientName, phone, location } = req.body;
  if (!patientName || !phone || !location) {
    return next(new ErrorHandler("Please Fill Full Form!", 400));
  }
  const request = await AmbulanceRequest.create({
    patientName,
    phone,
    location,
  });
  res.status(200).json({
    success: true,
    message: "Ambulance Request Sent Successfully!",
    request,
  });
});

export const getAmbulanceRequests = catchAsyncErrors(async (req, res, next) => {
  const requests = await AmbulanceRequest.find();
  res.status(200).json({
    success: true,
    requests,
  });
});

export const updateAmbulanceStatus = catchAsyncErrors(async (req, res, next) => {
  const { id } = req.params;
  const { status } = req.body;
  const request = await AmbulanceRequest.findByIdAndUpdate(id, { status }, { new: true });
  res.status(200).json({
    success: true,
    message: "Ambulance Status Updated!",
    request,
  });
});

export const getHospitalStats = catchAsyncErrors(async (req, res, next) => {
  let stats = await HospitalStats.findOne();
  if (!stats) {
    stats = await HospitalStats.create({});
  }
  res.status(200).json({
    success: true,
    stats,
  });
});

export const updateHospitalStats = catchAsyncErrors(async (req, res, next) => {
  let stats = await HospitalStats.findOne();
  if (!stats) {
    stats = await HospitalStats.create(req.body);
  } else {
    stats = await HospitalStats.findByIdAndUpdate(stats._id, req.body, { new: true });
  }
  res.status(200).json({
    success: true,
    message: "Hospital Stats Updated!",
    stats,
  });
});
