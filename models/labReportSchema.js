import mongoose from "mongoose";

const labReportSchema = new mongoose.Schema({
  patientId: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: true,
  },
  testName: {
    type: String,
    required: [true, "Test Name Is Required!"],
  },
  description: {
    type: String,
  },
  reportFile: {
    public_id: String,
    url: String,
  },
  status: {
    type: String,
    enum: ["Pending", "Completed"],
    default: "Pending",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export const LabReport = mongoose.model("LabReport", labReportSchema);
