const mongoose = require("mongoose");

const emergencyContactSchema = new mongoose.Schema(
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

const physicianSchema = new mongoose.Schema(
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

const patientSchema = new mongoose.Schema(
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

patientSchema.pre("save", async function (next) {
  if (this.medicalId) {
    return next();
  }

  const count = await mongoose.model("Patient").countDocuments();

  this.medicalId = `LT-${new Date().getFullYear()}-${String(
    count + 1
  ).padStart(4, "0")}`;

  next();
});

module.exports = mongoose.model("Patient", patientSchema);