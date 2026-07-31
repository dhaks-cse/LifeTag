import mongoose, { Schema, Document, Model, Types } from "mongoose";

export type EmergencySessionStatus = "ACTIVE" | "CLOSED";

export interface IEmergencySession extends Document {
  patientId: Types.ObjectId;
  medicalId: string;
  patientName?: string;
  bloodGroup?: string;
  status: EmergencySessionStatus;
  startedAt: Date;
  expiresAt: Date;
  lastViewedAt: Date;
  viewCount: number;
  createdBy: string;
  closedAt?: Date;
  duration?: number;
}

const emergencySessionSchema = new Schema<IEmergencySession>(
  {
    patientId: {
      type: Schema.Types.ObjectId,
      ref: "Patient",
      required: true,
      index: true,
    },

    medicalId: {
      type: String,
      required: true,
      index: true,
    },

    patientName: {
      type: String,
    },

    bloodGroup: {
      type: String,
    },

    status: {
      type: String,
      enum: ["ACTIVE", "CLOSED"],
      default: "ACTIVE",
      index: true,
    },

    startedAt: {
      type: Date,
      required: true,
    },

    expiresAt: {
      type: Date,
      required: true,
    },

    lastViewedAt: {
      type: Date,
      required: true,
    },

    viewCount: {
      type: Number,
      default: 1,
    },

    createdBy: {
      type: String,
      default: "PUBLIC_NFC",
    },

    closedAt: {
      type: Date,
    },

    duration: {
      type: Number,
    },
  },
  {
    timestamps: true,
  }
);

const EmergencySession: Model<IEmergencySession> = mongoose.model<IEmergencySession>(
  "EmergencySession",
  emergencySessionSchema
);

export default EmergencySession;
