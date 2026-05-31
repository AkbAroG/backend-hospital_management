import { catchAsyncErrors } from "../middlewares/catchAsyncErrors.js";
import ErrorHandler from "../middlewares/error.js";
import { LabReport } from "../models/labReportSchema.js";
import cloudinary from "cloudinary";

export const uploadReport = catchAsyncErrors(async (req, res, next) => {
  if (!req.files || Object.keys(req.files).length === 0) {
    return next(new ErrorHandler("Report File Required!", 400));
  }
  const { reportFile } = req.files;
  const { patientId, testName, description } = req.body;

  if (!patientId || !testName) {
    return next(new ErrorHandler("Patient ID and Test Name are required!", 400));
  }

  const cloudinaryResponse = await cloudinary.uploader.upload(
    reportFile.tempFilePath
  );
  if (!cloudinaryResponse || cloudinaryResponse.error) {
    console.error(
      "Cloudinary Error:",
      cloudinaryResponse.error || "Unknown Cloudinary error"
    );
    return next(
      new ErrorHandler("Failed To Upload Report to Cloudinary", 500)
    );
  }

  const report = await LabReport.create({
    patientId,
    testName,
    description,
    reportFile: {
      public_id: cloudinaryResponse.public_id,
      url: cloudinaryResponse.secure_url,
    },
    status: "Completed",
  });

  res.status(200).json({
    success: true,
    message: "Report Uploaded Successfully!",
    report,
  });
});

export const getPatientReports = catchAsyncErrors(async (req, res, next) => {
  const reports = await LabReport.find({ patientId: req.user._id });
  res.status(200).json({
    success: true,
    reports,
  });
});

export const getAllReports = catchAsyncErrors(async (req, res, next) => {
  const reports = await LabReport.find().populate("patientId", "firstName lastName");
  res.status(200).json({
    success: true,
    reports,
  });
});
