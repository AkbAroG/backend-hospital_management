import mongoose from "mongoose";

const ambulanceRequestSchema = new mongoose.Schema({
  patientName: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ["Pending", "Dispatched", "Arrived", "Cancelled"],
    default: "Pending",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const hospitalStatsSchema = new mongoose.Schema({
  icuAvailability: {
    type: Number,
    default: 0,
  },
  bloodBankInfo: [
    {
      bloodGroup: String,
      unitsAvailable: Number,
    },
  ],
  emergencyHelpline: {
    type: String,
    default: "911",
  },
});

export const AmbulanceRequest = mongoose.model("AmbulanceRequest", ambulanceRequestSchema);
export const HospitalStats = mongoose.model("HospitalStats", hospitalStatsSchema);
