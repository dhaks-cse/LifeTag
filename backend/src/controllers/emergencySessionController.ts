import { Request, Response, NextFunction } from "express";
import {
  startOrUpdateSession,
  getActiveSessions,
  getSessionHistory,
  closeSessionById,
} from "../services/emergencySessionService";

const startEmergencySession = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { medicalId } = req.body;

    if (!medicalId) {
      return res.status(400).json({
        success: false,
        message: "medicalId is required.",
      });
    }

    const session = await startOrUpdateSession(medicalId);

    if (!session) {
      return res.status(404).json({
        success: false,
        message: "Patient profile not found.",
      });
    }

    res.status(200).json({
      success: true,
      data: session,
    });
  } catch (error) {
    next(error);
  }
};

const getActiveEmergencySessions = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const sessions = await getActiveSessions();

    res.status(200).json({
      success: true,
      count: sessions.length,
      data: sessions,
    });
  } catch (error) {
    next(error);
  }
};

const getEmergencyHistory = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const sessions = await getSessionHistory();

    res.status(200).json({
      success: true,
      count: sessions.length,
      data: sessions,
    });
  } catch (error) {
    next(error);
  }
};

const closeEmergencySession = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const session = await closeSessionById(req.params.id);

    if (!session) {
      return res.status(404).json({
        success: false,
        message: "Active emergency session not found.",
      });
    }

    res.status(200).json({
      success: true,
      message: "Emergency session closed.",
      data: session,
    });
  } catch (error) {
    next(error);
  }
};

export {
  startEmergencySession,
  getActiveEmergencySessions,
  getEmergencyHistory,
  closeEmergencySession,
};
