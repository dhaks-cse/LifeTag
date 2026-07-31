import Patient from "../models/Patient";
import EmergencySession, { IEmergencySession } from "../models/EmergencySession";

const SESSION_DURATION_MS = 60 * 60 * 1000;

export async function closeExpiredSessions(): Promise<void> {
  const now = new Date();

  const expiredSessions = await EmergencySession.find({
    status: "ACTIVE",
    expiresAt: { $lte: now },
  });

  await Promise.all(
    expiredSessions.map((session) => {
      session.status = "CLOSED";
      session.closedAt = now;
      session.duration = Math.round((now.getTime() - session.startedAt.getTime()) / 1000);
      return session.save();
    })
  );
}

export async function startOrUpdateSession(medicalId: string): Promise<IEmergencySession | null> {
  await closeExpiredSessions();

  const now = new Date();

  const existingSession = await EmergencySession.findOneAndUpdate(
    { medicalId, status: "ACTIVE", expiresAt: { $gt: now } },
    { $inc: { viewCount: 1 }, $set: { lastViewedAt: now } },
    { new: true }
  );

  if (existingSession) {
    return existingSession;
  }

  const patient = await Patient.findOne({ medicalId });

  if (!patient) {
    return null;
  }

  const session = await EmergencySession.create({
    patientId: patient._id,
    medicalId,
    patientName: patient.fullName,
    bloodGroup: patient.bloodGroup,
    status: "ACTIVE",
    startedAt: now,
    expiresAt: new Date(now.getTime() + SESSION_DURATION_MS),
    lastViewedAt: now,
    viewCount: 1,
    createdBy: "PUBLIC_NFC",
  });

  return session;
}

export async function getActiveSessions(): Promise<IEmergencySession[]> {
  await closeExpiredSessions();
  return EmergencySession.find({ status: "ACTIVE" }).sort({ lastViewedAt: -1 });
}

export async function getSessionHistory(): Promise<IEmergencySession[]> {
  await closeExpiredSessions();
  return EmergencySession.find({ status: "CLOSED" }).sort({ closedAt: -1 }).limit(200);
}

export async function closeSessionById(id: string): Promise<IEmergencySession | null> {
  const session = await EmergencySession.findById(id);

  if (!session || session.status !== "ACTIVE") {
    return null;
  }

  const now = new Date();
  session.status = "CLOSED";
  session.closedAt = now;
  session.duration = Math.round((now.getTime() - session.startedAt.getTime()) / 1000);

  await session.save();
  return session;
}
