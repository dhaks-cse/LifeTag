import express from "express";
import {
  createPatient,
  getAllPatients,
  getPatientByMedicalId,
  updatePatient,
  deletePatient,
  searchPatients,
} from "../controllers/patientController";

const router = express.Router();

router.get("/search", searchPatients);
router.get("/", getAllPatients);
router.post("/", createPatient);
router.get("/:medicalId", getPatientByMedicalId);
router.put("/:medicalId", updatePatient);
router.delete("/:medicalId", deletePatient);

export default router;
