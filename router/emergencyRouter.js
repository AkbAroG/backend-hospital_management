import express from "express";
import {
  requestAmbulance,
  getAmbulanceRequests,
  updateAmbulanceStatus,
  getHospitalStats,
  updateHospitalStats,
} from "../controller/emergencyController.js";
import { isAdminAuthenticated } from "../middlewares/auth.js";

const router = express.Router();

router.post("/ambulance/request", requestAmbulance);
router.get("/ambulance/all", isAdminAuthenticated, getAmbulanceRequests);
router.put("/ambulance/update/:id", isAdminAuthenticated, updateAmbulanceStatus);
router.get("/stats", getHospitalStats);
router.put("/stats/update", isAdminAuthenticated, updateHospitalStats);

export default router;
