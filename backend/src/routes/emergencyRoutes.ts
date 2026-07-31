import express from "express";
import requireAdmin from "../middleware/requireAdmin";
import {
  startEmergencySession,
  getActiveEmergencySessions,
  getEmergencyHistory,
  closeEmergencySession,
} from "../controllers/emergencySessionController";

const router = express.Router();

router.post("/start", startEmergencySession);
router.get("/active", requireAdmin, getActiveEmergencySessions);
router.get("/history", requireAdmin, getEmergencyHistory);
router.patch("/close/:id", requireAdmin, closeEmergencySession);

export default router;
