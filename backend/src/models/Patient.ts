import mongoose, { Schema, Document, Model } from "mongoose";

export interface IEmergencyContact {
  name: string;
  relation: string;
  phone: string;
}

export interface IPhysician {
  name?: string;
  hospital?: string;
  phone?: string;
}

export interface IPatient extends Document {
  medicalId?: string;
  fullName: string;
  dateOfBirth?: Date;
  gender?: "Male" | "Female" | "Other";
  bloodGroup: "A+" | "A-" | "B+" | "B-" | "AB+" | "AB-" | "O+" | "O-";
  photoUrl?: string;
  allergies: string[];
  chronicConditions: string[];
  currentMedications: string[];
  emergencyContacts: IEmergencyContact[];
  primaryPhysician?: IPhysician;
  organDonor: boolean;
  notes: string;
}

const emergencyContactSchema = new Schema<IEmergencyContact>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    relation: {
      type: String,
      required: true,
      trim: true,
    },
    phone: {
      type: String,
      required: true,
      trim: true,
    },
  },
  { _id: false }
);

const physicianSchema = new Schema<IPhysician>(
  {
    name: {
      type: String,
      trim: true,
    },
    hospital: {
      type: String,
      trim: true,
    },
    phone: {
      type: String,
      trim: true,
    },
  },
  { _id: false }
);

const patientSchema = new Schema<IPatient>(
  {
    medicalId: {
      type: String,
      unique: true,
      index: true,
    },

    fullName: {
      type: String,
      required: true,
      trim: true,
    },

    dateOfBirth: {
      type: Date,
    },

    gender: {
      type: String,
      enum: ["Male", "Female", "Other"],
    },

    bloodGroup: {
      type: String,
      required: true,
      enum: [
        "A+",
        "A-",
        "B+",
        "B-",
        "AB+",
        "AB-",
        "O+",
        "O-",
      ],
    },

    photoUrl: {
      type: String,
      default: "",
    },

    allergies: {
      type: [String],
      default: [],
    },

    chronicConditions: {
      type: [String],
      default: [],
    },

    currentMedications: {
      type: [String],
      default: [],
    },

    emergencyContacts: {
      type: [emergencyContactSchema],
      default: [],
    },

    primaryPhysician: physicianSchema,

    organDonor: {
      type: Boolean,
      default: false,
    },

    notes: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

patientSchema.pre<IPatient>("save", async function (next) {
  if (this.medicalId) {
    return next();
  }

  const count = await mongoose.model("Patient").countDocuments();

  this.medicalId = `LT-${new Date().getFullYear()}-${String(
    count + 1
  ).padStart(4, "0")}`;

  next();
});

const Patient: Model<IPatient> = mongoose.model<IPatient>("Patient", patientSchema);

export default Patient;
