export type EmergencySessionStatus = "ACTIVE" | "CLOSED";

export interface EmergencySession {
  _id: string;
  patientId: string;
  medicalId: string;
  patientName?: string;
  bloodGroup?: string;
  status: EmergencySessionStatus;
  startedAt: string;
  expiresAt: string;
  lastViewedAt: string;
  viewCount: number;
  createdBy: string;
  closedAt?: string;
  duration?: number;
}
