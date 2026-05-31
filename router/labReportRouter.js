import express from "express";
import {
  uploadReport,
  getPatientReports,
  getAllReports,
} from "../controller/labReportController.js";
import {
  isAdminAuthenticated,
  isPatientAuthenticated,
} from "../middlewares/auth.js";

const router = express.Router();

router.post("/upload", isAdminAuthenticated, uploadReport);
router.get("/myreports", isPatientAuthenticated, getPatientReports);
router.get("/all", isAdminAuthenticated, getAllReports);

export default router;
